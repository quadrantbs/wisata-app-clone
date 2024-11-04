<template>
    <div class="card-inner p-6 sm:p-8 rounded-lg shadow-md">
        <p class="text-xl font-semibold text-center text-gray-800 mb-6">
            Sign in to Wisata App
        </p>

        <form @submit.prevent="handleSignIn" class="space-y-6">
            <div class="relative">
                <label for="username" class="text-sm text-gray-500 absolute px-2 bg-white -top-2 left-3">
                    Username or email
                </label>
                <input id="username" type="text" class="input-field" autocomplete="username" v-model="username"
                    placeholder="Enter your username or email" />
            </div>

            <button type="button" class="btn-primary" @click="handleContinue">
                Continue
            </button>

            <!-- Separator for Other Sign-in Options -->
            <div class="flex text-center items-center my-6 text-gray-400">
                <p class="px-4 text-xs">Or continue with</p>
            </div>

            <button class="btn-secondary mb-3">
                <span class="text-sm font-medium">Google</span>
            </button>

            <button class="btn-secondary mb-3">
                <span class="text-sm font-medium">Apple</span>
            </button>
            <button class="btn-secondary ">
                <span class="text-sm font-medium">Whatsapp</span>
            </button>

            <button class="d-flex mt-4 mx-auto "><span>
                    Create New Account
                </span></button>
        </form>
    </div>
</template>

<script>
export default {
    name: 'SignInCard',
    data() {
        return {
            username: '',
            password: ''
        };
    },
    methods: {
        handleSignIn() {
            // Handle sign-in logic here
        },
        handleContinue() {
            // Handle continue logic
        },
        sendOtp() {
            // Logic to send OTP
        }
    }
};
</script>

<style scoped>
.card-inner {
    max-width: 400px;
    margin: auto;
    background-color: #ffffff;
    padding: 16px;
}

.text-center {
    color: #333333;
}

.input-field {
    width: 100%;
    padding: 0.75rem 1rem;
    margin-top: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    outline: none;
    transition: border-color 0.2s;
}

.input-field:focus {
    border-color: #3b82f6;
}

.btn-primary {
    width: 100%;
    padding: 0.75rem;
    background-color: #3b82f6;
    color: #ffffff;
    font-weight: 500;
    text-align: center;
    border-radius: 0.375rem;
    transition: background-color 0.2s;
}

.btn-primary:hover {
    background-color: #2563eb;
}

.btn-secondary {
    width: 100%;
    padding: 0.75rem;
    background-color: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    text-align: center;
    transition: background-color 0.2s;
}

.btn-secondary:hover {
    background-color: #f3f4f6;
}
</style>
