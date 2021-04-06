/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { RoshanAsset } from './roshan-asset';

@Info({title: 'RoshanAssetContract', description: 'My Smart Contract' })
export class RoshanAssetContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async roshanAssetExists(ctx: Context, roshanAssetId: string): Promise<boolean> {
        const data: Uint8Array = await ctx.stub.getState(roshanAssetId);
        return (!!data && data.length > 0);
    }

    @Transaction()
    public async createRoshanAsset(ctx: Context, roshanAssetId: string, value: string): Promise<void> {
        const exists: boolean = await this.roshanAssetExists(ctx, roshanAssetId);
        if (exists) {
            throw new Error(`The roshan asset ${roshanAssetId} already exists`);
        }
        const roshanAsset: RoshanAsset = new RoshanAsset();
        roshanAsset.value = value;
        const buffer: Buffer = Buffer.from(JSON.stringify(roshanAsset));
        await ctx.stub.putState(roshanAssetId, buffer);
    }

    @Transaction(false)
    @Returns('RoshanAsset')
    public async readRoshanAsset(ctx: Context, roshanAssetId: string): Promise<RoshanAsset> {
        const exists: boolean = await this.roshanAssetExists(ctx, roshanAssetId);
        if (!exists) {
            throw new Error(`The roshan asset ${roshanAssetId} does not exist`);
        }
        const data: Uint8Array = await ctx.stub.getState(roshanAssetId);
        const roshanAsset: RoshanAsset = JSON.parse(data.toString()) as RoshanAsset;
        return roshanAsset;
    }

    @Transaction()
    public async updateRoshanAsset(ctx: Context, roshanAssetId: string, newValue: string): Promise<void> {
        const exists: boolean = await this.roshanAssetExists(ctx, roshanAssetId);
        if (!exists) {
            throw new Error(`The roshan asset ${roshanAssetId} does not exist`);
        }
        const roshanAsset: RoshanAsset = new RoshanAsset();
        roshanAsset.value = newValue;
        const buffer: Buffer = Buffer.from(JSON.stringify(roshanAsset));
        await ctx.stub.putState(roshanAssetId, buffer);
    }

    @Transaction()
    public async deleteRoshanAsset(ctx: Context, roshanAssetId: string): Promise<void> {
        const exists: boolean = await this.roshanAssetExists(ctx, roshanAssetId);
        if (!exists) {
            throw new Error(`The roshan asset ${roshanAssetId} does not exist`);
        }
        await ctx.stub.deleteState(roshanAssetId);
    }

}
