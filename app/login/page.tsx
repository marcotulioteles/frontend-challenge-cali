import Link from "next/link";

export default async function Page() {
    return (
        <main className="grid min-h-screen bg-gradient-to-br from-primary-900 from-5% via-primary-400 via-60% to-primary-900 to-100%">
            <div className="flex flex-col items-center md:grid md:grid-cols-2 md:gap-6 w-full max-w-7xl p-6 m-auto">
                <div className="mb-8 self-center">
                    <h1 className="text-5xl md:text-6xl xl:text-8xl font-bold text-white mb-4">
                        payment app
                    </h1>
                    <span className="text-white text-sm md:text-base">
                        powered by Marco Reis
                    </span>
                </div>
                <form className="bg-white p-8 rounded-xl shadow-2xl h-fit w-full m-auto md:max-w-sm space-y-6">
                    <h1 className="text-4xl font-bold mb-6 text-primary-400 mx-auto w-fit">
                        Login
                    </h1>
                    <div className="grid gap-6">
                        <input
                            className="input-field"
                            type="email"
                            placeholder="Email"
                            required
                        />
                        <input
                            className="input-field"
                            type="password"
                            placeholder="Password"
                            required
                        />
                        <button className="primary-btn mt-6" type="submit">
                            Login
                        </button>
                        <div>
                            <p className="text-sm text-gray-600">
                                Don't have an account?{" "}
                                <Link
                                    href="/register"
                                    className="text-primary-400 hover:font-medium"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}
