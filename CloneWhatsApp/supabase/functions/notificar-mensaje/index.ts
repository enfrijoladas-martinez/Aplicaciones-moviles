import { createClient } from "npm:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

type CuentaServicio = {
  project_id: string;
  client_email: string;
  private_key: string;
};

let accesoGoogle: { token: string; vence: number } | null = null;

function responder(datos: unknown, estado = 200) {
  return new Response(JSON.stringify(datos), {
    status: estado,
    headers: { "Content-Type": "application/json" },
  });
}

function base64url(entrada: Uint8Array | string) {
  const bytes = typeof entrada === "string" ? new TextEncoder().encode(entrada) : entrada;
  let binario = "";
  for (const byte of bytes) {
    binario += String.fromCharCode(byte);
  }
  return btoa(binario).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function tokenDeGoogle(cuenta: CuentaServicio) {
  if (accesoGoogle && accesoGoogle.vence > Date.now() + 60_000) {
    return accesoGoogle.token;
  }

  const ahora = Math.floor(Date.now() / 1000);
  const encabezado = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const reclamos = base64url(JSON.stringify({
    iss: cuenta.client_email,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    iat: ahora,
    exp: ahora + 3600,
  }));

  const pem = cuenta.private_key
    .replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----/g, "")
    .replace(/\\n/g, "")
    .replace(/\s/g, "");
  const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));

  const llave = await crypto.subtle.importKey(
    "pkcs8",
    der,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const firma = new Uint8Array(await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    llave,
    new TextEncoder().encode(`${encabezado}.${reclamos}`),
  ));

  const respuesta = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${encabezado}.${reclamos}.${base64url(firma)}`,
    }),
  });

  if (!respuesta.ok) {
    throw new Error(`Google no dio el token: ${await respuesta.text()}`);
  }

  const datos = await respuesta.json();
  accesoGoogle = { token: datos.access_token, vence: Date.now() + datos.expires_in * 1000 };
  return accesoGoogle.token;
}

function nombreCompleto(perfil: { nombre?: string; apellido?: string } | null) {
  if (!perfil) {
    return "Alguien";
  }
  const apellido = perfil.apellido && perfil.apellido !== "Sin apellido" ? ` ${perfil.apellido}` : "";
  return `${perfil.nombre ?? "Alguien"}${apellido}`;
}

Deno.serve(async (peticion) => {
  if (peticion.method !== "POST") {
    return responder({ error: "Metodo no permitido" }, 405);
  }

  const { data: secreto } = await supabase.rpc("secreto_webhook");

  if (!secreto || peticion.headers.get("x-webhook-secret") !== secreto) {
    return responder({ error: "No autorizado" }, 401);
  }

  const { id_message } = await peticion.json().catch(() => ({ id_message: null }));

  if (!id_message) {
    return responder({ error: "Falta id_message" }, 400);
  }

  const { data: mensaje } = await supabase
    .from("messages")
    .select(
      "id_message, id_conversacion, id_remitente, contenido, tipo, eliminado, " +
        "remitente:profiles(nombre, apellido), conversacion:conversaciones(tipo, nombre)",
    )
    .eq("id_message", id_message)
    .maybeSingle();

  if (!mensaje || mensaje.eliminado) {
    return responder({ enviadas: 0, motivo: "mensaje no encontrado" });
  }

  const { data: miembros } = await supabase
    .from("conversaciones_members")
    .select("id_profile")
    .eq("id_conversacion", mensaje.id_conversacion)
    .neq("id_profile", mensaje.id_remitente);

  const destinatarios = (miembros ?? []).map((miembro) => miembro.id_profile);

  if (destinatarios.length === 0) {
    return responder({ enviadas: 0, motivo: "sin destinatarios" });
  }

  const { data: dispositivos } = await supabase
    .from("devices")
    .select("id_device, token_push")
    .in("id_profile", destinatarios)
    .eq("activo", true)
    .not("token_push", "is", null);

  if (!dispositivos || dispositivos.length === 0) {
    return responder({ enviadas: 0, motivo: "sin dispositivos registrados" });
  }

  const cuentaTexto = Deno.env.get("FIREBASE_SERVICE_ACCOUNT");

  if (!cuentaTexto) {
    return responder({ error: "Falta el secreto FIREBASE_SERVICE_ACCOUNT" }, 500);
  }

  let cuenta: CuentaServicio;

  try {
    const leida = JSON.parse(cuentaTexto);
    cuenta = (typeof leida === "string" ? JSON.parse(leida) : leida) as CuentaServicio;
  } catch {
    return responder({ error: "FIREBASE_SERVICE_ACCOUNT no es un JSON valido" }, 500);
  }

  if (!cuenta.private_key || !cuenta.client_email || !cuenta.project_id) {
    return responder({
      error: "FIREBASE_SERVICE_ACCOUNT no es la clave de una cuenta de servicio",
      campos_encontrados: Object.keys(cuenta),
    }, 500);
  }

  let acceso: string;

  try {
    acceso = await tokenDeGoogle(cuenta);
  } catch (error) {
    return responder({ error: String(error) }, 500);
  }

  const remitente = nombreCompleto(mensaje.remitente as { nombre?: string; apellido?: string });
  const conversacion = mensaje.conversacion as { tipo?: string; nombre?: string } | null;
  const esGrupo = conversacion?.tipo === "grupal";
  const texto = mensaje.tipo === "imagen"
    ? (mensaje.contenido ? `Foto: ${mensaje.contenido}` : "Foto")
    : (mensaje.contenido ?? "");

  const tituloChat = esGrupo ? (conversacion?.nombre ?? "Grupo") : remitente;

  let enviadas = 0;
  let fallidas = 0;

  for (const dispositivo of dispositivos) {
    const respuesta = await fetch(
      `https://fcm.googleapis.com/v1/projects/${cuenta.project_id}/messages:send`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${acceso}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: {
            token: dispositivo.token_push,
            data: {
              id_conversacion: mensaje.id_conversacion,
              titulo_chat: tituloChat,
              es_grupo: String(esGrupo),
              titulo: tituloChat,
              cuerpo: esGrupo ? `${remitente}: ${texto}` : texto,
            },
            android: { priority: "HIGH" },
          },
        }),
      },
    );

    if (respuesta.ok) {
      enviadas++;
      continue;
    }

    fallidas++;
    const error = await respuesta.text();

    if (respuesta.status === 404 || error.includes("UNREGISTERED")) {
      await supabase.from("devices").update({ activo: false }).eq("id_device", dispositivo.id_device);
    } else {
      console.error("FCM rechazo el envio", respuesta.status, error);
    }
  }

  return responder({ enviadas, fallidas });
});
