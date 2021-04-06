/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity } from 'fabric-shim';
import { RoshanAssetContract } from '.';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import winston = require('winston');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext implements Context {
    public stub: sinon.SinonStubbedInstance<ChaincodeStub> = sinon.createStubInstance(ChaincodeStub);
    public clientIdentity: sinon.SinonStubbedInstance<ClientIdentity> = sinon.createStubInstance(ClientIdentity);
    public logger = {
        getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
        setLevel: sinon.stub(),
     };
}

describe('RoshanAssetContract', () => {

    let contract: RoshanAssetContract;
    let ctx: TestContext;

    beforeEach(() => {
        contract = new RoshanAssetContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"roshan asset 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"roshan asset 1002 value"}'));
    });

    describe('#roshanAssetExists', () => {

        it('should return true for a roshan asset', async () => {
            await contract.roshanAssetExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a roshan asset that does not exist', async () => {
            await contract.roshanAssetExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createRoshanAsset', () => {

        it('should create a roshan asset', async () => {
            await contract.createRoshanAsset(ctx, '1003', 'roshan asset 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"roshan asset 1003 value"}'));
        });

        it('should throw an error for a roshan asset that already exists', async () => {
            await contract.createRoshanAsset(ctx, '1001', 'myvalue').should.be.rejectedWith(/The roshan asset 1001 already exists/);
        });

    });

    describe('#readRoshanAsset', () => {

        it('should return a roshan asset', async () => {
            await contract.readRoshanAsset(ctx, '1001').should.eventually.deep.equal({ value: 'roshan asset 1001 value' });
        });

        it('should throw an error for a roshan asset that does not exist', async () => {
            await contract.readRoshanAsset(ctx, '1003').should.be.rejectedWith(/The roshan asset 1003 does not exist/);
        });

    });

    describe('#updateRoshanAsset', () => {

        it('should update a roshan asset', async () => {
            await contract.updateRoshanAsset(ctx, '1001', 'roshan asset 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"roshan asset 1001 new value"}'));
        });

        it('should throw an error for a roshan asset that does not exist', async () => {
            await contract.updateRoshanAsset(ctx, '1003', 'roshan asset 1003 new value').should.be.rejectedWith(/The roshan asset 1003 does not exist/);
        });

    });

    describe('#deleteRoshanAsset', () => {

        it('should delete a roshan asset', async () => {
            await contract.deleteRoshanAsset(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a roshan asset that does not exist', async () => {
            await contract.deleteRoshanAsset(ctx, '1003').should.be.rejectedWith(/The roshan asset 1003 does not exist/);
        });

    });

});
