import { binService } from "@/config/container";
import { BinFilterBuilder } from "@/interface/bin.interface";
import { buildQuery, normalizeQuery } from "@/interface/query.interface";
import AppError from "@/utils/appError";
import asyncHandler from "@/utils/asyncHandler";
import { Request, Response } from "express";

// POST | /api/v1/bins
export const createBin = asyncHandler(async (req: Request, res: Response) => {
  const dto = req.body;

  if (req.file) {
    dto.coverImage = req.file.path; // URL từ Cloudinary
  }

  const data = await binService.create(dto);

  res.status(201).json({
    status: "success",
    data,
  });
});

// GET | /api/v1/bins
export const getBins = asyncHandler(async (req: Request, res: Response) => {
  const query = buildQuery(req.query, new BinFilterBuilder());
  console.log(query);
  const result = await binService.findAll(query);

  res.status(200).json({
    status: "success",
    results: result.data.length,
    total: result.total,
    page: result.page,
    totalPages: result.totalPages,
    data: result.data,
  });
});

// GET | /api/v1/bins/:id
export const getBin = asyncHandler(async (req: Request, res: Response) => {
  const data = await binService.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data,
  });
});

// PATCH | /api/v1/bins/:id
export const updateBin = asyncHandler(async (req: Request, res: Response) => {
  const dto = req.body;

  if (req.file) {
    dto.coverImage = req.file.path;
  }

  const data = await binService.update(req.params.id, dto);

  res.status(200).json({
    status: "success",
    data,
  });
});

// DELETE | /api/v1/bins/:id
export const deleteBin = asyncHandler(async (req: Request, res: Response) => {
  await binService.delete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});

// GET | /api/v1/bins/nearby
export const getNearbyBins = asyncHandler(
  async (req: Request, res: Response) => {
    const { lat, lng, dist } = req.query;

    if (!lat || !lng) {
      throw new AppError("Vui lòng cung cấp vĩ độ (lat) và kinh độ (lng)", 400);
    }

    const result = await binService.getNearbyBins(
      Number(lat),
      Number(lng),
      dist ? Number(dist) : undefined,
    );

    res.status(200).json({
      status: "success",
      count: result.length,
      data: result,
    });
  },
);
