import { render, screen } from "@testing-library/react";
import AdminStatCard from "../AdminStatCard";

describe("AdminStatCard", () => {
  test("renderiza la información estadística correctamente", () => {
    render(
      <AdminStatCard
        icon="⌂"
        label="Total de Pueblos"
        value="6"
        trend="5 activos"
      />
    );

    expect(screen.getByText("⌂")).toBeInTheDocument();
    expect(screen.getByText("Total de Pueblos")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("5 activos")).toBeInTheDocument();
  });

  test("renderiza aunque no tenga trend", () => {
    render(
      <AdminStatCard
        icon="⌖"
        label="Lugares Turísticos"
        value="10"
      />
    );

    expect(screen.getByText("⌖")).toBeInTheDocument();
    expect(screen.getByText("Lugares Turísticos")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });
});