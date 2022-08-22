// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Modal} from 'react-bootstrap';

import {isModalOpen} from 'selectors/views/modals';
import {ModalIdentifiers} from 'utils/constants';
import {Invoice} from '@mattermost/types/cloud';
import {closeModal} from 'actions/views/modals';
import {GlobalState} from 'types/store';

import BillingHistoryTable from './billing_history_table';
import './billing_history_modal.scss';

type BillingHistoryModalProps = {
    invoices: Invoice[] | undefined;
    onHide?: () => void;
}

const invoiceListToRecordList = (invoices: Invoice[]) => {
    const records = {} as Record<string, Invoice>;
    invoices.forEach((invoice) => {
        records[invoice.id] = invoice;
    });
    return records;
};

export default function BillingHistoryModal(props: BillingHistoryModalProps) {
    const dispatch = useDispatch();
    const isBillingHistoryModalOpen = useSelector((state: GlobalState) => isModalOpen(state, ModalIdentifiers.BILLING_HISTORY));

    if (!props.invoices) {
        return null;
    }

    const onHide = () => {
        dispatch(closeModal(ModalIdentifiers.BILLING_HISTORY));

        if (typeof props.onHide === 'function') {
            props.onHide();
        }
    };

    return (
        <Modal
            show={isBillingHistoryModalOpen}
            onExited={onHide}
            onHide={onHide}
            id='cloud-billing-history-modal'
            className='CloudBillingHistoryModal'
        >
            <Modal.Header closeButton={true}>
                <Modal.Title>{'Unpaid Invoice(s)'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <BillingHistoryTable invoices={invoiceListToRecordList(props.invoices)}/>
            </Modal.Body>
        </Modal>
    );
}