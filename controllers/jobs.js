const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllJobs = async (req, res) => {
	const jobs = await Job.find({ createdBy: req.user.userID }).sort('createdAt')
	res.status(StatusCodes.OK).json({ count: jobs.length, jobs })
}

const createJob = async (req, res) => {
	req.body.createdBy = req.user.userID
	const job = await Job.create(req.body)
	res.status(StatusCodes.CREATED).json({ job })
}

const getJob = async (req, res) => {
	const { user: { userID }, params: { id: jobID }, body: { company, position } } = req
	const job = await Job.findOne({
		_id: jobID,
		createdBy: userID
	})
	if (!job) {
		throw new NotFoundError('No job found')
	}
	res.status(StatusCodes.OK).json({ job })
}

const updateJob = async (req, res) => {
	const { user: { userID }, params: { id: jobID }, body: { company, position } } = req

	if (company === '' || position === '') {
		throw new BadRequestError('Company and position should not be empty')
	}
	const job = await Job.findByIdAndUpdate({ _id: jobID, createdBy: userID }, req.body, { new: true, runValidators: true })
	if (!job) {
		throw new NotFoundError('No job found')
	}
	res.status(StatusCodes.OK).json({ job })
}
const deleteJob = async (req, res) => {
	const { user: { userID }, params: { id: jobID } } = req;
	const job = await Job.findOneAndDelete({
		_id: jobID,
		createdBy: userID
	})
	// const test = await Job.findOneAndDelete({
	// 	_id:jobID,
	// 	createBy: userID
	// })
	if (!job) {
		throw new NotFoundError('No job found')
	}
	res.status(StatusCodes.OK).json({ job })
}

module.exports = {
	getAllJobs,
	createJob,
	getJob,
	updateJob,
	deleteJob
}
