// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode} from 'react';
import {useSelector} from 'react-redux';

import {useCurrentProduct, useCurrentProductId} from 'utils/products';

import {getAppBarAppBindings} from 'mattermost-redux/selectors/entities/apps';
import {getAppBarPluginComponents, getChannelHeaderPluginComponents, shouldShowAppBar} from 'selectors/plugins';
import {inScope} from '@mattermost/types/products';

import AppBarPluginComponent, {isAppBarPluginComponent} from './app_bar_plugin_component';
import AppBarBinding, {isAppBinding} from './app_bar_binding';

import './app_bar.scss';

export default function AppBar() {
    const channelHeaderComponents = useSelector(getChannelHeaderPluginComponents);
    const appBarPluginComponents = useSelector(getAppBarPluginComponents);
    const appBarBindings = useSelector(getAppBarAppBindings);
    const currentProduct = useCurrentProduct();
    const currentProductId = useCurrentProductId();

    const enabled = useSelector(shouldShowAppBar);

    if (
        !enabled ||
        (currentProduct && !currentProduct.showAppBar)
    ) {
        return null;
    }

    const coreProductsIds = ['focalboard', 'playbooks'];

    // The type guard in the filter (which removes all undefined elements) is needed for
    // Typescript to correctly type coreProducts.
    const coreProductComponents = coreProductsIds.
        map((id) => appBarPluginComponents.find((element) => element.pluginId === id));

    const pluginComponents = appBarPluginComponents.filter((element) => !coreProductComponents.includes(element));

    const items: ReactNode[] = [
        ...coreProductComponents,
        divider,
        ...pluginComponents,
        ...channelHeaderComponents,
        ...appBarBindings,
    ].map((x) => {
        if (isAppBarPluginComponent(x)) {
            if (!inScope(x.supportedProductIds ?? null, currentProductId, currentProduct?.pluginId)) {
                return null;
            }
            return (
                <AppBarPluginComponent
                    key={x.id}
                    component={x}
                />
            );
        } else if (isAppBinding(x)) {
            if (!inScope(x.supported_product_ids ?? null, currentProductId, currentProduct?.pluginId)) {
                return null;
            }
            return (
                <AppBarBinding
                    key={`${x.app_id}_${x.label}`}
                    binding={x}
                />
            );
        }
        return x;
    });

    if (!items.some((x) => Boolean(x) && x !== divider)) {
        return null;
    }

    return (
        <div className={'app-bar'}>
            <div
                css={`
                    height: 100%;
                    padding-top: 16px;
                    border-left: solid 1px rgba(var(--center-channel-color-rgb), 0.12);
                    background-color: rgba(var(--center-channel-color-rgb), 0.04);
                `}
            >
                {items}
            </div>
        </div>
    );
}

const divider = (
    <hr
        key='divider'
        className={'app-bar__divider'}
        css={`
            :last-child {
                display: none;
            }
        `}
    />
);
