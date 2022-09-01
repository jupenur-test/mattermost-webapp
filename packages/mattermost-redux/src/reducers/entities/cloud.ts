// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {combineReducers} from 'redux';

import {CloudTypes} from 'mattermost-redux/action_types';

import {GenericAction} from 'mattermost-redux/types/actions';
import {Product, Subscription, SubscriptionResponse, CloudCustomer, Invoice, Limits} from '@mattermost/types/cloud';

import {LegacyFreeProductIds} from 'utils/constants';

export function subscription(state: Subscription | null = null, action: GenericAction) {
    switch (action.type) {
    case CloudTypes.RECEIVED_CLOUD_SUBSCRIPTION: {
        const responseSubscription: SubscriptionResponse = action.data;
        const {is_paid_tier: isPaidTier, ...baseSubscription} = responseSubscription;
        const subscription: Subscription = {...baseSubscription};
        if (LegacyFreeProductIds[subscription.product_id] && isPaidTier === 'true') {
            subscription.is_legacy_cloud_paid_tier = true;
        }
        return subscription;
    }
    default:
        return state;
    }
}

function customer(state: CloudCustomer | null = null, action: GenericAction) {
    switch (action.type) {
    case CloudTypes.RECEIVED_CLOUD_CUSTOMER: {
        return action.data;
    }
    default:
        return state;
    }
}

function products(state: Record<string, Product> | null = null, action: GenericAction) {
    switch (action.type) {
    case CloudTypes.RECEIVED_CLOUD_PRODUCTS: {
        const productList: Product[] = action.data;
        const productDict = productList.reduce((map, obj) => {
            map[obj.id] = obj;
            return map;
        }, {} as Record<string, Product>);
        return {
            ...state,
            ...productDict,
        };
    }
    default:
        return state;
    }
}

function invoices(state: Record<string, Invoice> | null = null, action: GenericAction) {
    switch (action.type) {
    case CloudTypes.RECEIVED_CLOUD_INVOICES: {
        const invoiceList: Invoice[] = action.data;
        const invoiceDict = invoiceList.reduce((map, obj) => {
            map[obj.id] = obj;
            return map;
        }, {} as Record<string, Invoice>);
        return {
            ...state,
            ...invoiceDict,
        };
    }
    default:
        return state;
    }
}

export interface LimitsReducer {
    limits: Limits;
    limitsLoaded: boolean;
}
const emptyLimits = {
    limits: {},
    limitsLoaded: false,
};
export function limits(state: LimitsReducer = emptyLimits, action: GenericAction) {
    switch (action.type) {
    case CloudTypes.RECEIVED_CLOUD_LIMITS: {
        return {
            limits: action.data,
            limitsLoaded: true,
        };
    }
    default:
        return state;
    }
}
export interface ErrorsReducer {
    subscription?: true;
    products?: true;
    customer?: true;
    invoices?: true;
    limits?: true;
}
const emptyErrors = {};
export function errors(state: ErrorsReducer = emptyErrors, action: GenericAction) {
    switch (action.type) {
    case CloudTypes.CLOUD_SUBSCRIPTION_FAILED: {
        return {...state, subscription: true};
    }
    case CloudTypes.CLOUD_PRODUCTS_FAILED: {
        return {...state, products: true};
    }
    case CloudTypes.CLOUD_CUSTOMER_FAILED: {
        return {...state, customer: true};
    }
    case CloudTypes.CLOUD_INVOICES_FAILED: {
        return {...state, invoices: true};
    }
    case CloudTypes.CLOUD_LIMITS_FAILED: {
        return {...state, limits: true};
    }

    case CloudTypes.RECEIVED_CLOUD_SUBSCRIPTION: {
        const {subscription, ...newState} = state;
        return newState;
    }
    case CloudTypes.RECEIVED_CLOUD_PRODUCTS: {
        const {products, ...newState} = state;
        return newState;
    }
    case CloudTypes.RECEIVED_CLOUD_CUSTOMER: {
        const {customer, ...newState} = state;
        return newState;
    }
    case CloudTypes.RECEIVED_CLOUD_INVOICES: {
        const {invoices, ...newState} = state;
        return newState;
    }
    case CloudTypes.RECEIVED_CLOUD_LIMITS: {
        const {limits, ...newState} = state;
        return newState;
    }

    case CloudTypes.CLOUD_SUBSCRIPTION_REQUEST: {
        const {subscription, ...newState} = state;
        return newState;
    }
    case CloudTypes.CLOUD_PRODUCTS_REQUEST: {
        const {products, ...newState} = state;
        return newState;
    }
    case CloudTypes.CLOUD_CUSTOMER_REQUEST: {
        const {customer, ...newState} = state;
        return newState;
    }
    case CloudTypes.CLOUD_INVOICES_REQUEST: {
        const {invoices, ...newState} = state;
        return newState;
    }
    case CloudTypes.CLOUD_LIMITS_REQUEST: {
        const {limits, ...newState} = state;
        return newState;
    }

    default: {
        return state;
    }
    }
}

export default combineReducers({

    // represents the current cloud customer
    customer,

    // represents the current cloud subscription
    subscription,

    // represents the cloud products offered
    products,

    // represents the invoices tied to the current subscription
    invoices,

    // represents the usage limits associated with this workspace
    limits,

    // network errors, used to show errors in ui instead of blowing up and showing nothing
    errors,
});
