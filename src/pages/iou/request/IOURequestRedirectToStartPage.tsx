import React, {useEffect, useRef} from 'react';
import FullPageNotFoundView from '@components/BlockingViews/FullPageNotFoundView';
import ScreenWrapper from '@components/ScreenWrapper';
import useOnyx from '@hooks/useOnyx';
import Navigation from '@libs/Navigation/Navigation';
import {generateReportID} from '@libs/ReportUtils';
import {clearMoneyRequest} from '@userActions/IOU/MoneyRequest';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import ROUTES from '@src/ROUTES';
import type SCREENS from '@src/SCREENS';
import {validTransactionDraftIDsSelector} from '@src/selectors/TransactionDraft';
import isLoadingOnyxValue from '@src/types/utils/isLoadingOnyxValue';
import type {WithWritableReportOrNotFoundProps} from './step/withWritableReportOrNotFound';

type IOURequestRedirectToStartPageProps = WithWritableReportOrNotFoundProps<typeof SCREENS.MONEY_REQUEST.START>;

function IOURequestRedirectToStartPage({
    route: {
        params: {iouType, iouRequestType},
    },
}: IOURequestRedirectToStartPageProps) {
    const isIouTypeValid = Object.values(CONST.IOU.TYPE).includes(iouType);
    const isIouRequestTypeValid = Object.values(CONST.IOU.REQUEST_TYPE).includes(iouRequestType);
    const hasRedirectedRef = useRef(false);
    const [draftTransactionIDs, draftTransactionsMetadata] = useOnyx(ONYXKEYS.COLLECTION.TRANSACTION_DRAFT, {
        selector: validTransactionDraftIDsSelector,
    });

    useEffect(() => {
        if (hasRedirectedRef.current || !isIouTypeValid || !isIouRequestTypeValid || isLoadingOnyxValue(draftTransactionsMetadata)) {
            return;
        }
        hasRedirectedRef.current = true;

        // Dismiss this modal because the redirects below will open a new modal and there shouldn't be two modals stacked on top of each other.
        Navigation.dismissModal();
        // Quick-action deeplinks reuse OPTIMISTIC_TRANSACTION_ID, so clear any previous request draft before entering the new flow.
        clearMoneyRequest(CONST.IOU.OPTIMISTIC_TRANSACTION_ID, draftTransactionIDs);

        // Redirect the person to the right start page using a random reportID
        const optimisticReportID = generateReportID();
        if (iouRequestType === CONST.IOU.REQUEST_TYPE.DISTANCE) {
            Navigation.navigate(ROUTES.MONEY_REQUEST_CREATE_TAB_DISTANCE.getRoute(CONST.IOU.ACTION.CREATE, iouType, CONST.IOU.OPTIMISTIC_TRANSACTION_ID, optimisticReportID));
        } else if (iouRequestType === CONST.IOU.REQUEST_TYPE.MANUAL) {
            Navigation.navigate(ROUTES.MONEY_REQUEST_CREATE_TAB_MANUAL.getRoute(CONST.IOU.ACTION.CREATE, iouType, CONST.IOU.OPTIMISTIC_TRANSACTION_ID, optimisticReportID));
        } else if (iouRequestType === CONST.IOU.REQUEST_TYPE.SCAN) {
            Navigation.navigate(ROUTES.MONEY_REQUEST_CREATE_TAB_SCAN.getRoute(CONST.IOU.ACTION.CREATE, iouType, CONST.IOU.OPTIMISTIC_TRANSACTION_ID, optimisticReportID));
        } else if (iouRequestType === CONST.IOU.REQUEST_TYPE.DISTANCE_MAP) {
            Navigation.navigate(ROUTES.DISTANCE_REQUEST_CREATE_TAB_MAP.getRoute(CONST.IOU.ACTION.CREATE, iouType, CONST.IOU.OPTIMISTIC_TRANSACTION_ID, optimisticReportID));
        } else if (iouRequestType === CONST.IOU.REQUEST_TYPE.DISTANCE_MANUAL) {
            Navigation.navigate(ROUTES.DISTANCE_REQUEST_CREATE_TAB_MANUAL.getRoute(CONST.IOU.ACTION.CREATE, iouType, CONST.IOU.OPTIMISTIC_TRANSACTION_ID, optimisticReportID));
        } else if (iouRequestType === CONST.IOU.REQUEST_TYPE.DISTANCE_GPS) {
            Navigation.navigate(ROUTES.DISTANCE_REQUEST_CREATE_TAB_GPS.getRoute(CONST.IOU.ACTION.CREATE, iouType, CONST.IOU.OPTIMISTIC_TRANSACTION_ID, optimisticReportID));
        } else if (iouRequestType === CONST.IOU.REQUEST_TYPE.DISTANCE_ODOMETER) {
            Navigation.navigate(ROUTES.DISTANCE_REQUEST_CREATE_TAB_ODOMETER.getRoute(CONST.IOU.ACTION.CREATE, iouType, CONST.IOU.OPTIMISTIC_TRANSACTION_ID, optimisticReportID));
        } else if (iouRequestType === CONST.IOU.REQUEST_TYPE.TIME) {
            Navigation.navigate(ROUTES.MONEY_REQUEST_CREATE_TAB_TIME.getRoute(CONST.IOU.ACTION.CREATE, iouType, CONST.IOU.OPTIMISTIC_TRANSACTION_ID, optimisticReportID));
        }
    }, [draftTransactionIDs, draftTransactionsMetadata, iouRequestType, iouType, isIouRequestTypeValid, isIouTypeValid]);

    if (!isIouTypeValid || !isIouRequestTypeValid) {
        return (
            <ScreenWrapper testID="IOURequestRedirectToStartPage">
                <FullPageNotFoundView shouldShow />
            </ScreenWrapper>
        );
    }

    return null;
}

export default IOURequestRedirectToStartPage;
