using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace RevolutionBackend.Migrations
{
    /// <inheritdoc />
    public partial class InstructoresCorregido : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Instructores",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    NombreCompleto = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    Especialidad = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    Telefono = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    Salario = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Instructores", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Socios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    NombreCompleto = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    Telefono = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false),
                    FechaRegistro = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Vencimiento = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Estado = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Descuento = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Socios", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    NombreCompleto = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    Telefono = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: false),
                    Username = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: false),
                    Password = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false),
                    Activo = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Actividades",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Nombre = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    Duracion = table.Column<int>(type: "int", nullable: false),
                    CupoMaximo = table.Column<int>(type: "int", nullable: false),
                    Precio = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    InstructorId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Actividades", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Actividades_Instructores_InstructorId",
                        column: x => x.InstructorId,
                        principalTable: "Instructores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "HorariosActividades",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    ActividadId = table.Column<int>(type: "int", nullable: false),
                    Fecha = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DiaSemana = table.Column<int>(type: "int", nullable: false),
                    HoraInicio = table.Column<TimeSpan>(type: "time(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HorariosActividades", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HorariosActividades_Actividades_ActividadId",
                        column: x => x.ActividadId,
                        principalTable: "Actividades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Inscripciones",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    FechaInscripcion = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    SocioId = table.Column<int>(type: "int", nullable: false),
                    ActividadId = table.Column<int>(type: "int", nullable: false),
                    HorarioActividadId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Inscripciones", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Inscripciones_Actividades_ActividadId",
                        column: x => x.ActividadId,
                        principalTable: "Actividades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Inscripciones_HorariosActividades_HorarioActividadId",
                        column: x => x.HorarioActividadId,
                        principalTable: "HorariosActividades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Inscripciones_Socios_SocioId",
                        column: x => x.SocioId,
                        principalTable: "Socios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Actividades_InstructorId",
                table: "Actividades",
                column: "InstructorId");

            migrationBuilder.CreateIndex(
                name: "IX_HorariosActividades_ActividadId",
                table: "HorariosActividades",
                column: "ActividadId");

            migrationBuilder.CreateIndex(
                name: "IX_Inscripciones_ActividadId",
                table: "Inscripciones",
                column: "ActividadId");

            migrationBuilder.CreateIndex(
                name: "IX_Inscripciones_HorarioActividadId",
                table: "Inscripciones",
                column: "HorarioActividadId");

            migrationBuilder.CreateIndex(
                name: "IX_Inscripciones_SocioId",
                table: "Inscripciones",
                column: "SocioId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Inscripciones");

            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.DropTable(
                name: "HorariosActividades");

            migrationBuilder.DropTable(
                name: "Socios");

            migrationBuilder.DropTable(
                name: "Actividades");

            migrationBuilder.DropTable(
                name: "Instructores");
        }
    }
}
