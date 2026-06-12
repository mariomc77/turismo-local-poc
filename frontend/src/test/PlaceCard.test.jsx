import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import PlaceCard from "../components/PlaceCard";

describe("PlaceCard", () => {
  const place = {
    id: 1,
    name: "Playa Principal",
    description: "Una playa muy bonita",
    category: "PLAYA",
    address: "Playas del Coco",
    imageUrl: "https://example.com/playa.jpg"
  };

  test("muestra la información del lugar", () => {
    render(<PlaceCard place={place} onViewDetails={() => {}} />);

    expect(screen.getByText("Playa Principal")).toBeInTheDocument();
    expect(screen.getByText("Una playa muy bonita")).toBeInTheDocument();
    expect(screen.getByText("PLAYA")).toBeInTheDocument();
    expect(screen.getByText(/Playas del Coco/i)).toBeInTheDocument();
    expect(screen.getByAltText("Playa Principal")).toBeInTheDocument();
  });

  test("ejecuta onViewDetails al presionar Ver más detalles", () => {
    const onViewDetails = vi.fn();

    render(<PlaceCard place={place} onViewDetails={onViewDetails} />);

    fireEvent.click(screen.getByText(/Ver más detalles/i));

    expect(onViewDetails).toHaveBeenCalledWith(place);
  });
});