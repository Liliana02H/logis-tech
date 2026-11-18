package com.logistech.backend.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConexionBD {

 private static final String URL =
    "jdbc:mysql://127.0.0.1:3306/prueba_logis_tech?sslMode=DISABLED&allowPublicKeyRetrieval=true";

private static final String USUARIO = "logistech";
private static final String CLAVE = "LogisTech2026!";
    public static Connection conectar() {
        try {
            Connection conexion = DriverManager.getConnection(
                URL, USUARIO, CLAVE
            );

            System.out.println("Conexion exitosa con MySQL");
            return conexion;

        } catch (SQLException e) {
            System.out.println("Error de conexion: " + e.getMessage());
            return null;
        }
    }
    public static void main(String[] args) {
    Connection conexion = conectar();

    if (conexion != null) {
        System.out.println("LOGIS-TECH conectado correctamente");
    } else {
        System.out.println("Error al conectar con MySQL");
    }
}
}