<template>
    <div v-if="data" class="mt-8 mb-16">
        <section>
            <h2 class="text-h5 text-sm-h4 font-weight-medium mb-0">About the property</h2>
            <p class="text-body-2 my-2">
                {{ data.general_info.descriptions.location }}<br>
                {{ data.general_info.descriptions.dining }}<br>
                {{ data.general_info.descriptions.amenities }}
            </p>

            <h3 class="mb-2 pt-4 text-h7 text-md-h6 font-weight-medium">Languages</h3>
            <p class="text-body-2 mb-0">
                {{ Object.keys(data.general_info.spoken_languages).map(lang =>
                    data.general_info.spoken_languages[lang].name).join(', ') }}
            </p>
        </section>

        <section class="pt-8 pt-sm-12">
            <div>
                <h2 class="text-h5 text-sm-h4 font-weight-medium mb-0">Policies</h2>
                <div class="row pt-4 no-gutters">
                    <div class="col col-12">
                        <div class="d-flex">
                            <h3>
                                <p class="text-h7 text-md-h6 mb-2 font-weight-medium">Check-in</p>
                                <p class="mb-0 text-body-1">{{ data.important_info.checkin.begin_time }}</p>
                            </h3>
                            <h3 class="pl-6">
                                <p class="text-h7 text-md-h6 mb-2 font-weight-medium">Check-out</p>
                                <p class="mb-0 text-body-1">{{ data.important_info.checkout.time }}</p>
                            </h3>
                        </div>

                        <h3 class="text-h7 text-md-h6 font-weight-medium mt-4 mb-0">Additional check-in information</h3>
                        <div class="text-body-2 pt-2 styled-list" v-html="data.important_info.checkin.instructions">
                        </div>
                    </div>
                </div>

                <div class="row mt-4 no-gutters">
                    <div class="col col-12">
                        <h3 class="text-h7 text-md-h6 font-weight-medium mb-0">Others</h3>
                    </div>
                    <div class="pt-2 col col-12">
                        <div class="text-body-2 styled-list" v-html="data.important_info.policies.know_before_you_go">
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="pt-8 pt-sm-12">
            <h2 class="text-h5 text-sm-h4 font-weight-medium mb-0">Important information</h2>
            <div class="row pt-4 no-gutters">
                <div class="col col-12">
                    <div>
                        <h3 class="text-h7 text-md-h6 font-weight-medium mb-2">
                            <span class="text-capitalize">optional</span> charges
                        </h3>
                        <div class="text-body-2 property-charges styled-list" v-html="data.important_info.fees.optional">
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>

const propertyStore = usePropertyStore();

const data = ref(propertyStore.propertyData);

</script>

<style scoped>
.styled-list {
    list-style: disc;      
    padding-left: 1rem;   
}

</style>