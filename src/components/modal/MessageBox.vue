<template>
    <Dialog
        class="p-confirm-dialog"
        modal
        dismissableMask
        :visible="msgBoxStore.visible"
        :header="msgBoxStore.caption"
        @hide="onHide"
    >
        <div v-dompurify-html="msgBoxStore.message"></div>
        <template #footer>
            <div class="footArea">
            <div class="btnArea end">
                <BaseButton
                    v-if="msgBoxStore.buttons === MessageBoxButtons.OKCancel"
                    class="btn default mwd60 h34 bgWhite bdWhite fz14"
                    label="취소"
                    @click="cancel"/>
                <BaseButton
                    class="btn default mwd60 h34 bgBlue2 fz14"
                    label="확인"
                    @click="ok"
                    autofocus/>
            </div>
            </div>
        </template>
    </Dialog>
</template>

<script setup>
import { useMsgBoxStore, MessageBoxButtons, DialogResult } from '@/stores/ui.msgBox';
import BaseButton from "@/components/bases/BaseButton.vue";
const msgBoxStore = useMsgBoxStore();

function onHide() {
    if (msgBoxStore.result !== DialogResult.None) {
        if (msgBoxStore.resolve) {
            msgBoxStore.result = DialogResult.Cancel;
            msgBoxStore.resolve(msgBoxStore.result);
        }
    }
}

function ok() {
    msgBoxStore.hide();

    if (msgBoxStore.resolve) {
        msgBoxStore.result = DialogResult.OK;
        msgBoxStore.resolve(msgBoxStore.result);
    }
}

function cancel() {
    msgBoxStore.hide();

    if (msgBoxStore.resolve) {
        msgBoxStore.result = DialogResult.Cancel;
        msgBoxStore.resolve(msgBoxStore.result);
    }
}
</script>
