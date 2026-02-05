// Datos de usuarios y turnos - Febrero 2026
const USUARIOS = {
  "Krishna Olea": ["VAC","VAC","VAC","VAC","VAC","VAC","VAC","VAC","LIBRE","LIBRE","AM","AM","AM","AM","AM","LIBRE","AM","AM","PM","PM","PM","LIBRE","PM","LIBRE","AM","PM","AM","LIBRE"],
  "Jose Villagra (reemplazo)": ["AM","AM","AM","PM","LIBRE","AM","LIBRE","AM","N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A"],
  "Viviana Medina": ["PM","PM","LIBRE","LIBRE","AM","PM","AM","PM","LIBRE","PM","AM","AM","PM","AM","LIBRE","LIBRE","PM","AM","PM","AM","PM","LIBRE","PM","LIBRE","PM","AM","PM","AM"],
  "Daniela Illanes": ["AM","AM","AM","AM","LIBRE","PM","LIBRE","PM","LIBRE","PM","PM","PM","AM","LIBRE","PM","AM","PM","LIBRE","AM","PM","AM","LIBRE","AM","PM","LIBRE","PM","AM","PM"],
  "Diego  Salinas": ["LIBRE","LIBRE","PM","PM","AM","PM","PM","LIBRE","PM","AM","LIBRE","AM","LIBRE","AM","PM","AM","AM","AM","LIBRE","AM","PM","LIBRE","LIBRE","PM","PM","AM","PM","AM"],
  "Alejandro Calfuman": ["LIBRE","PM","LIBRE","AM","PM","LIBRE","PM","AM","PM","LIBRE","AM","AM","AM","LIBRE","PM","AM","PM","LIBRE","AM","PM","AM","LIBRE","AM","PM","AM","PM","AM","LIBRE"],
  "Renato  Fuentes": ["PM","LIBRE","PM","AM","PM","AM","AM","LIBRE","PM","AM","LIBRE","PM","LIBRE","PM","AM","PM","LIBRE","PM","AM","PM","AM","LIBRE","AM","AM","AM","PM","LIBRE","AM"],
  "Daniela Cheuquenao": ["AM","AM","LIBRE","AM","AM","LIBRE","AM","PM","AM","LIBRE","PM","AM","PM","LIBRE","PM","PM","PM","AM","LIBRE","AM","PM","LIBRE","AM","AM","LIBRE","PM","AM","LIBRE"],
  "Diego  Martínez": ["LIBRE","PM","PM","PM","AM","AM","AM","LIBRE","AM","AM","AM","PM","PM","PM","LIBRE","AM","AM","PM","AM","AM","AM","LIBRE","AM","AM","AM","AM","AM","AM"],
  "Juan  Chávez": ["LIBRE","PM","AM","PM","AM","AM","PM","LIBRE","PM","PM","PM","AM","AM","AM","LIBRE","PM","PM","PM","PM","PM","AM","LIBRE","AM","AM","AM","AM","AM","PM"],
  "Rocio Álvarez": ["LIBRE","AM","PM","AM","PM","PM","PM","LIBRE","AM","AM","AM","PM","PM","PM","LIBRE","AM","AM","PM","AM","AM","AM","LIBRE","PM","PM","PM","PM","PM","PM"],
  "Valentina  Obando": ["LIBRE","AM","AM","AM","PM","PM","PM","LIBRE","AM","PM","PM","AM","AM","AM","LIBRE","PM","PM","PM","PM","PM","PM","LIBRE","PM","PM","PM","PM","PM","PM"],
  "Alexis Ladino": ["AM","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","PM","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","AM","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","PM","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE"],
  "Yuliana Obando": ["PM","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","AM","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","PM","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","AM","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE"],
  "Catalina Pedreros": ["AM","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","PM","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","AM","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","PM","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE"],
  "Catalina Sepúlveda": ["PM","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","AM","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","PM","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","AM","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE"],
  "Escarlet  Rozas": ["FULL","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","FULL","FULL","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","FULL","FULL","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","FULL","FULL","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","FULL"],
  "Enzo Oliva": ["FULL","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","FULL","FULL","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","FULL","FULL","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","FULL","FULL","LIBRE","LIBRE","LIBRE","LIBRE","LIBRE","FULL"],
  "Pamela Figueroa": ["AM","AM","AM","LIBRE","PM","PM","PM","LIBRE","LIBRE","AM","AM","AM","PM","PM","LIBRE","AM","PM","PM","PM","LIBRE","LIBRE","AM","AM","AM","PM","LIBRE","AM","LIBRE"],
  "José Ortiz": ["LIBRE","AM","PM","PM","LIBRE","AM","LIBRE","AM","AM","PM","LIBRE","LIBRE","AM","AM","AM","AM","AM","LIBRE","AM","AM","AM","LIBRE","PM","PM","LIBRE","PM","AM","AM"],
  "Maria Jesús Rozas": ["LIBRE","PM","AM","LIBRE","LIBRE","VAC","VAC","VAC","VAC","VAC","VAC","VAC","LIBRE","LIBRE","PM","LIBRE","AM","LIBRE","PM","PM","PM","LIBRE","LIBRE","AM","AM","AM","LIBRE","PM"],
  "Catalina Sandoval": ["PM","PM","LIBRE","AM","AM","AM","AM","LIBRE","AM","LIBRE","PM","PM","LIBRE","AM","LIBRE","PM","LIBRE","AM","AM","AM","LIBRE","PM","AM","LIBRE","PM","AM","PM","AM"]
};

// Nombres de días
const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// Día actual (4 de febrero = miércoles)
const HOY = 4;

// Mes y año
const MES = 'Febrero';
const ANIO = 2026;
