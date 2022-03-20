/** @jsxRuntime classic */
/** @jsx jsx */

import { assertOutput, buildTestHarness } from "slate-test-utils";
import EditorBody from "../../../src/components/EditorBody";
import { jsx } from '../../slateTestUtils';
import userEvent from '@testing-library/user-event';
import { ShowModal } from "../../../src/components/LinkToolbarButton";


const badLink = 'https://link';
const linkText = 'Link text';

async function setUp(input: JSX.Element) {
    const user = userEvent.setup();

    const onBodyUpdate = jest
        .fn()
        .mockName('onBodyUpdate');

    const [editor, slateTestUtils, reactTestUtils] = await buildTestHarness(EditorBody)({
        editor: input,
        componentProps: { onBodyUpdate }
    });

    return {
        user,
        editor,
        slateTestUtils,
        reactTestUtils,
        modalEpectedToShow: (showModal: ShowModal) => {
            const notToBeInTheDocument = [
                /Please enter a valid url/,
                /Convert link to text/,
                /Enter the URL of the link:/
            ];

            let index: number | undefined;

            if (showModal == 'alert') {
                index = 0;
            } else if (showModal == 'confirm') {
                index = 1;
            } else if (showModal == 'prompt') {
                index = 2;
            }

            if (index !== undefined) {
                const toBeInTheDocument = notToBeInTheDocument.splice(index, 1);

                toBeInTheDocument.forEach(pattern => {
                    expect(reactTestUtils.getByText(pattern)).toBeInTheDocument();
                })
            }

            notToBeInTheDocument.forEach(pattern => {
                expect(reactTestUtils.queryByText(pattern)).not.toBeInTheDocument();
            })
        }
    }

}


test('user interations with link', async () => {
    //# Arrange
    const linkComplete = '.com';
    const input = (
        <editor>
            <hp>
                <hlink link={badLink}>
                    Link Te<cursor />xt
                </hlink>
            </hp>
        </editor>
    );

    const {
        user,
        editor,
        reactTestUtils: { findByTestId, getByTestId },
        slateTestUtils: { rerender },
        modalEpectedToShow
    } = await setUp(input);

    // Act
    await user.click(await findByTestId('link-toolbar-button'));
    // Assert
    modalEpectedToShow('prompt');
    expect(getByTestId('link-modal-url-input')).toHaveValue(badLink);

    // Act
    await user.click(getByTestId('link-modal-done-button'));
    // Assert
    modalEpectedToShow('alert');

    // Act
    await user.click(getByTestId('link-modal-alert-okay-button'));
    // Assert
    modalEpectedToShow('prompt');

    // Act
    await user.type(getByTestId('link-modal-url-input'), linkComplete);
    assertOutput(editor, input)

    // TODO: [TypeError: Cannot read property 'bind' of undefined] when onBodyUpdate is set on the editor, maybe related to: https://github.com/newtmex/afrikweb/issues/2
    await user.click(getByTestId('link-modal-done-button'));
    // Assert
    modalEpectedToShow(null);

});

test('interaction with LinkElement with link attribute being an empty string', async () => {
    const {
        user,
        reactTestUtils: { findByTestId },
        modalEpectedToShow
    } = await setUp(
        <editor>
            <hp>
                <hlink link=''>
                    Link Te<cursor />xt
                </hlink>
            </hp>
        </editor>
    )

    // Act
    await user.click(await findByTestId('link-toolbar-button'));
    // Assert
    modalEpectedToShow('prompt');

})
