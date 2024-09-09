import {Schema} from 'mongoose';

import type {Entity} from './_base.js';
import type {UserInterface} from './user.js';
import type {ArrayValues, Jsonify} from '@gecut/types';

const AgentRequestStatuses = ['request', 'under-review', 'confirmed', 'rejected'] as const;

/**
 * @extends {Entity}
 */
export interface AgentRequestInterface extends Entity {
  status: ArrayValues<typeof AgentRequestStatuses>;
  message?: string;

  user: UserInterface;
}

export type AgentRequestData = Jsonify<AgentRequestInterface>;

export const $AgentRequestSchema = new Schema<AgentRequestInterface>(
  {
    status: {type: String, enum: AgentRequestStatuses, required: true, default: 'request'},
    message: String,
    user: {type: Schema.ObjectId, ref: 'User'},

    disabled: {type: Boolean, default: false},
  },
  {
    timestamps: true,
  },
);
