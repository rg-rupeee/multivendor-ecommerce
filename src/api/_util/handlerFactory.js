const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const APIFeatures = require("./apiFeatures");

exports.deleteOne = (Model, entity) =>
  catchAsync(async (req, res, next) => {
    if (!entity) {
      entity = "document";
    }

    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError(`No ${entity} found with that ID`, 404));
    }

    res.status(200).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model, entity) =>
  catchAsync(async (req, res, next) => {
    if (!entity) {
      entity = "document";
    }

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError(`No ${entity} found with that ID`, 404));
    }

    const response = {
      status: "success",
    };
    response[entity] = doc;
    res.status(201).json(response);
  });

exports.createOne = (Model, entity) =>
  catchAsync(async (req, res, next) => {
    if (!entity) {
      entity = "document";
    }

    const doc = await Model.create(req.body);

    const response = {
      status: "success",
    };
    response[entity] = doc;
    res.status(201).json(response);
  });

exports.getOne = (Model, entity, popOptions) =>
  catchAsync(async (req, res, next) => {
    if (!entity) {
      entity = "document";
    }

    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError(`No ${entity} found with that ID`, 404));
    }

    const response = {
      status: "success",
    };
    response[entity] = doc;

    res.status(200).json(response);
  });

exports.getAll = (Model, entity) =>
  catchAsync(async (req, res, next) => {
    if (!entity) {
      entity = "document";
    }

    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    const response = {
      status: "success",
      results: doc.length,
    };
    response[entity] = doc;
    res.status(200).json(response);
  });
