import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import AdminTable from "../components/AdminTable";

describe("AdminTable", () => {
  test("renderiza columnas y datos", () => {
    const columns = [
      { key: "name", label: "Nombre" },
      { key: "email", label: "Correo" }
    ];

    const data = [
      { id: 1, name: "Mario", email: "mario@gmail.com" },
      { id: 2, name: "Admin", email: "admin@gmail.com" }
    ];

    render(<AdminTable columns={columns} data={data} />);

    expect(screen.getByText("Nombre")).toBeInTheDocument();
    expect(screen.getByText("Correo")).toBeInTheDocument();
    expect(screen.getByText("Mario")).toBeInTheDocument();
    expect(screen.getByText("mario@gmail.com")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("admin@gmail.com")).toBeInTheDocument();
  });

  test("renderiza acciones cuando se envía renderActions", () => {
    const columns = [{ key: "name", label: "Nombre" }];
    const data = [{ id: 1, name: "Tamarindo" }];

    render(
      <AdminTable
        columns={columns}
        data={data}
        renderActions={(row) => <button>Editar {row.name}</button>}
      />
    );

    expect(screen.getByText("Acciones")).toBeInTheDocument();
    expect(screen.getByText("Editar Tamarindo")).toBeInTheDocument();
  });
});