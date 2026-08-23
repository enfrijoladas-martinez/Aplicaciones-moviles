import {View, Text, Image, ImageBackground, StyleSheet, Dimensions} from "react-native";
export default function ImagenFondo(){
    return(
        <View>
            <ImageBackground
                source={require('../assets/oleksii-drozdov-W2nmr548VPg-unsplash.jpg')}      
                style={styles.fondo}
            >
                <View style={styles.franja}>
                    <Text style={styles.titulo}>PAPUGATOS</Text>
                </View>

                <View style={styles.centro}>
                    <Image
                        source={{uri:'https://http.cat/510'}}
                        style={styles.foto}
                    />
                </View>

            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    fondo:{
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
    franja:{
        width: "100%",
        marginTop: 60,
        paddingVertical: 16,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        alignItems: "center",
        justifyContent: "center"
    },
    titulo:{
        color: "#ffffff",
        fontSize: 32,
        fontWeight: "bold",
        letterSpacing: 3
    },
    centro:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    foto:{
        width:160,
        height:160,
        borderRadius:16,
        borderWidth:10,
        borderColor:'#b5f',
        shadowColor:'#000',
        shadowOffset:{width:0, height:6 },
        shadowRadius: 10,
        elevation: 8,
    },
});
