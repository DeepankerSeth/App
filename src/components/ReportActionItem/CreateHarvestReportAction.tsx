import React from 'react';
import RenderHTML from '@components/RenderHTML';
import useLocalize from '@hooks/useLocalize';
import useOnyx from '@hooks/useOnyx';
import {getHarvestCreatedExpenseReportMessage, getReportActionHtml} from '@libs/ReportActionsUtils';
import {getReportName} from '@libs/ReportNameUtils';
import type {PartialReportAction} from '@libs/ReportUtils';
import ReportActionItemBasicMessage from '@pages/inbox/report/ReportActionItemBasicMessage';
import ONYXKEYS from '@src/ONYXKEYS';

const ANCHOR_WITH_TEXT_REGEX = /<a\b[^>]*href=(["'])[^"']+\1[^>]*>[\s\S]+?<\/a>/i;

type CreateHarvestReportActionProps = {
    /** Report action that created the harvest report */
    action: PartialReportAction;

    /** The original ID of the report */
    reportNameValuePairsOriginalID: string | undefined;
};

function CreateHarvestReportAction({action, reportNameValuePairsOriginalID}: CreateHarvestReportActionProps) {
    const {translate} = useLocalize();
    const [harvestReport] = useOnyx(`${ONYXKEYS.COLLECTION.REPORT}${reportNameValuePairsOriginalID}`);
    const harvestReportName = getReportName(harvestReport);
    const actionHtml = getReportActionHtml(action);
    const fallbackReportName = harvestReportName || (reportNameValuePairsOriginalID ? `#${reportNameValuePairsOriginalID}` : '');
    const harvestCreatedMessage = ANCHOR_WITH_TEXT_REGEX.test(actionHtml)
        ? actionHtml
        : getHarvestCreatedExpenseReportMessage(harvestReport?.reportID ?? reportNameValuePairsOriginalID, fallbackReportName, translate);
    const htmlContent = `<comment><muted-text>${harvestCreatedMessage}</muted-text></comment>`;

    return (
        <ReportActionItemBasicMessage>
            <RenderHTML html={htmlContent} />
        </ReportActionItemBasicMessage>
    );
}

export default CreateHarvestReportAction;
