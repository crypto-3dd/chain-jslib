import ow from 'ow';

import { owOptionalCoin } from '../../../coin/ow.types';
import { owBig, owOptionalBig, owStrictObject } from '../../../ow.types';
import { owCosmosMsg } from '../../../transaction/msg/cosmosMsg';
import { owBytes } from '../../../utils/bytes/ow.types';
import { cosmos } from '../codec';

export const owTxBody = () =>
    owStrictObject().exactShape({
        typeUrl: ow.string.equals('/cosmos.tx.v1beta1.TxBody'),
        value: owStrictObject().exactShape({
            messages: ow.array.ofType(owCosmosMsg()),
            memo: ow.string,
            timeoutHeight: ow.number.integer.greaterThanOrEqual(0), // Note that 0 is the default value when not set
        }),
    });

export const owAuthInfo = () =>
    owStrictObject().exactShape({
        signerInfos: ow.array.ofType(owSignerInfo()),
        fee: owStrictObject().exactShape({
            amount: owOptionalCoin(),
            gasLimit: owOptionalBig(),
            payer: ow.optional.string,
            granter: ow.optional.string,
        }),
    });

export const owSignerInfo = () =>
    owStrictObject().exactShape({
        publicKey: owBytes(),
        modeInfo: owStrictObject().exactShape({
            single: owStrictObject().exactShape({
                mode: owCosmosSignMode(),
            }),
        }),
        sequence: owBig(),
    });

export const owCosmosSignMode = () =>
    ow.number.validate((value) => ({
        validator: Object.values(cosmos.tx.signing.v1beta1.SignMode).includes(value),
        message: `Expected mode to be one of Cosmos sign mode, got \`value\``,
    }));

export const owTxRaw = () =>
    owStrictObject().exactShape({
        bodyBytes: owBytes(),
        authInfoBytes: owBytes(),
        signatures: ow.array.ofType(owBytes()),
    });
