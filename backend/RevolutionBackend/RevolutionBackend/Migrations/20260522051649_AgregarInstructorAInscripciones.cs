using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RevolutionBackend.Migrations
{
    /// <inheritdoc />
    public partial class AgregarInstructorAInscripciones : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FechaInscripcion",
                table: "Inscripciones");

            migrationBuilder.AddColumn<int>(
                name: "InstructorId",
                table: "Inscripciones",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InstructorId",
                table: "Inscripciones");

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaInscripcion",
                table: "Inscripciones",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
