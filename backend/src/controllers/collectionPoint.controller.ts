import { collectionPointService } from "@/config/container";
import { CollectionPointFilterBuilder } from "@/interface/collectionPoint.interface";
import { buildQuery, normalizeQuery } from "@/interface/query.interface";
import asyncHandler from "@/utils/asyncHandler";
import { Request, Response } from "express";

export const createCollectionPoint = asyncHandler(
  async (req: Request, res: Response) => {
    const dto = req.body;

    if (req.file) {
      dto.image = req.file.path; // URL từ Cloudinary
    }
    console.log(dto);
    const data = await collectionPointService.create(dto);
    res.status(201).json({ status: "success", data });
  },
);

export const getCollectionPoints = asyncHandler(
  async (req: Request, res: Response) => {
    const query = buildQuery(req.query, new CollectionPointFilterBuilder());
    const data = await collectionPointService.findAll(query);
    res.status(200).json({ status: "success", ...data });
  },
);

export const getCollectionPoint = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await collectionPointService.findById(req.params.id);
    res.status(200).json({ status: "success", data });
  },
);

export const updateCollectionPoint = asyncHandler(
  async (req: Request, res: Response) => {
    const dto = req.body;
    if (req.file) {
      dto.image = req.file.path; // URL từ Cloudinary
    }
    const data = await collectionPointService.update(req.params.id, dto);
    res.status(200).json({ status: "success", data });
  },
);

export const deleteCollectionPoint = asyncHandler(
  async (req: Request, res: Response) => {
    await collectionPointService.delete(req.params.id);
    res.status(204).json({ status: "success", data: null });
  },
);
