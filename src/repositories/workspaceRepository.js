import { StatusCodes } from "http-status-codes";
import Workspace from "../schema/workspace";
import crudRepository from "./crudRepository.js";
import ClientError from '../utils/errors/clientError.js'
import mongoose from "mongoose";
import Channel from "../schema/channel.js";
import User from "../schema/user.js";
import channelRepository from "./channelRepository.js";

const workspaceRepository = {
    ...crudRepository(Workspace),
    getWorkspaceByName: async function (workspaceName) {
        const workspace = await Workspace.findOne({ name: workspaceName });

        if (!workspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Workspace not found',
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        return workspace;
    },
    getWorkspaceByJoinCode: async function (workspaceJoinCode) {
        const workspace = await Workspace.findOne({ joinCode: workspaceJoinCode }); 4

        if (!workspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Workspace not found',
                statusCode: StatusCodes.NOT_FOUND
            });
        }
        return workspace;
    },

    addMemberToWorkspace: async function (workspaceId, memberId, memberRole) {
        const workspace = await Workspace.findById(workspaceId);

        if (!workspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Workspace not found',
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        const isValidUser = await User.find(memberId);

        if (!isValidUser) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'User not found',
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        const isAlreadyPartOfWorkspace = mongoose.members.find(member => member.memberId == memberId);

        if (isAlreadyPartOfWorkspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'User is already part of workspace',
                statusCode: StatusCodes.FORBIDDEN
            });
        }

        workspace.members.push({
            memberId,
            memberRole
        });

        await workspace.save();
        return workspace;
    },
    addChannelToWorkspace: async function (workspaceId, channelName) {
        const workspace = await Workspace.findById(workspaceId).populate('channels');

        if (!workspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Workspace not found',
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        const isChannelAlreadyPartOfWorkspace = workspace.channels.find(channel => channel.name == channelName);

        if(isChannelAlreadyPartOfWorkspace){
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Channel is already part of workspace',
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        const channel = await channelRepository.create({name:channelName});

        workspace.channels.push(channel.id);

        await workspace.save();

        return workspace;

    },
    fetchAllWorkspaceByMemberId: async function (memberId) {
        const workspaces = await Workspace.find({ 'members.memberId': memberId })
            .populate('members.member', 'username email avatar');

        return workspaces;
    }
}

export default workspaceRepository;
