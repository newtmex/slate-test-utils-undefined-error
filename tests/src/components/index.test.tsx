/** @jsxRuntime classic */
/** @jsx jsx */

import { assertOutput, buildTestHarness } from "slate-test-utils";
import EditorBody, { emptyBody } from "../../../src/components/EditorBody";
import { jsx } from '../../slateTestUtils';

const input = (
    <editor>
        <hp>
            <htext>
                <cursor />
            </htext>
        </hp>
    </editor>
);

it('can type into slate editor', async () => {
    const textToType = 'Growth is evident';

    const onBodyUpdate = jest
        .fn()
        .mockName('onBodyUpdate');

    const [editor, { type }, { getByText }] = await buildTestHarness(EditorBody)({
        editor: input,
        componentProps: { onBodyUpdate },
    });

    expect(editor.children).toEqual(emptyBody)

    await type(textToType);

    assertOutput(editor, <editor>
        <hp>
            <htext>
                {textToType}<cursor />
            </htext>
        </hp>
    </editor>);

    expect(getByText(textToType)).toBeInTheDocument();
    expect(onBodyUpdate).toHaveBeenLastCalledWith([{ type: 'paragraph', children: [{ text: textToType }] }]);
})
