import { ref } from 'vue';
import { defineStore } from 'pinia';

export enum MessageBoxButtons {
    OK = 0,
    OKCancel = 1
}
export enum DialogResult {
    None = 0,
    OK = 1,
    Cancel = 2
};

export const useMsgBoxStore = defineStore('msgBox', () => {
    const visible = ref(false);
    const message = ref('');
    const caption = ref('');

    const buttons = ref<MessageBoxButtons>(MessageBoxButtons.OK);
    const result = ref<DialogResult>(DialogResult.None);

    const resolve = ref({});

    function show(pMessage: string, pCaption: string, pButtons: MessageBoxButtons, pResolve?: any) {
        visible.value = true;
        message.value = pMessage;
        caption.value = pCaption;
        buttons.value = pButtons ? pButtons : MessageBoxButtons.OK;
        result.value = DialogResult.None;

        resolve.value = pResolve ? pResolve : undefined;
    }

    function hide() {
        visible.value = false;
    }

    return {
        visible,
        message,
        caption,

        buttons,
        result,

        show,
        hide,
        resolve,
    };
});