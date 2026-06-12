import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import QRCodeCard from "../components/QRCodeCard";

vi.mock("qrcode.react", () => ({
  QRCodeCanvas: () => <canvas data-testid="qr-canvas" />
}));

describe("QRCodeCard", () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue()
      }
    });

    vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.spyOn(window, "open").mockImplementation(() => {});
    vi.spyOn(window, "print").mockImplementation(() => {});
  });

  test("muestra el nombre del pueblo y la URL", () => {
    render(
      <QRCodeCard
        townName="Playas del Coco"
        qrUrl="https://turismo-local-poc.vercel.app/p/playas-del-coco"
      />
    );

    expect(screen.getByText("Playas del Coco")).toBeInTheDocument();
    expect(
      screen.getByText("https://turismo-local-poc.vercel.app/p/playas-del-coco")
    ).toBeInTheDocument();
  });

  test("abre la URL del QR", () => {
    render(
      <QRCodeCard
        townName="Playas del Coco"
        qrUrl="https://turismo-local-poc.vercel.app/p/playas-del-coco"
      />
    );

    fireEvent.click(screen.getByText(/Probar QR/i));

    expect(window.open).toHaveBeenCalledWith(
      "https://turismo-local-poc.vercel.app/p/playas-del-coco",
      "_blank"
    );
  });

  test("copia la URL al portapapeles", async () => {
    render(
      <QRCodeCard
        townName="Playas del Coco"
        qrUrl="https://turismo-local-poc.vercel.app/p/playas-del-coco"
      />
    );

    fireEvent.click(screen.getByText(/Copiar URL/i));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "https://turismo-local-poc.vercel.app/p/playas-del-coco"
    );
  });
});