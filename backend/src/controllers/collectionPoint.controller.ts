import { collectionPointService } from "@/config/container";
import { normalizeQuery } from "@/interface/query.interface";
import asyncHandler from "@/utils/asyncHandler";
import { Request, Response } from "express";

export const createCollectionPoint = asyncHandler(async (req: Request, res: Response) => {
  const data = await collectionPointService.create(req.body);
  res.status(201).json({ status: "success", data });
});

export const getCollectionPoints = asyncHandler(async (req: Request, res: Response) => {
  const query = normalizeQuery(req.query);
  const data = await collectionPointService.findAll(query);
  res.status(200).json({ status: "success", ...data });
});

export const getCollectionPoint = asyncHandler(async (req: Request, res: Response) => {
  const data = await collectionPointService.findById(req.params.id);
  res.status(200).json({ status: "success", data });
});

export const updateCollectionPoint = asyncHandler(async (req: Request, res: Response) => {
  const data = await collectionPointService.update(req.params.id, req.body);
  res.status(200).json({ status: "success", data });
});

export const deleteCollectionPoint = asyncHandler(async (req: Request, res: Response) => {
  await collectionPointService.delete(req.params.id);
  res.status(204).json({ status: "success", data: null });
});