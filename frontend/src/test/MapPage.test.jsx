import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import MapPage from "../pages/MapPage";

vi.mock("../components/Navbar", () => ({
  default: () => <nav>Navbar Mock</nav>
}));
