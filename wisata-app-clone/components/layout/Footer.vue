<template>
    <v-footer padless class="footer">
        <v-container max-width="1032px" class="container d-flex align-center py-3">
            <div class="d-flex align-center">
                <span class="text-body-2">©</span>&nbsp;Wisata App
                <span class="mx-3">·</span>
                <nuxt-link to="/" class="link text-h8 text--secondary">
                    Terms
                </nuxt-link>
            </div>

            <v-spacer></v-spacer>

            <span class="version text-no-wrap">
                v4.10
            </span>
        </v-container>
    </v-footer>
</template>

<script setup>

</script>

<style scoped>
.footer {
    background-color: #f5f5f5;
    color: #333;
}

.link {
    color: #757575;
    text-decoration: none;
}

.text-h8 {
    font-size: 14px;
}

.version {
    font-weight: 400;
    font-size: 12px;
    line-height: 19px;
}
</style>