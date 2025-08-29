import Link from "next/link";

export default async function Page() {
    return (
        <main className="grid w-full min-h-screen bg-gradient-to-br from-primary-900 from-5% via-primary-400 via-60% to-primary-900 to-100% text-center">
            <form className="bg-white p-8 rounded-xl shadow-2xl h-fit w-full m-auto md:max-w-sm space-y-6">
                <h1 className="text-4xl font-bold mb-6 text-primary-400 mx-auto w-fit">
                    Sign Up
                </h1>
                <div className="grid gap-6">
                    <input
                        className="input-field"
                        type="text"
                        placeholder="Full Name"
                        required
                    />
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
                    <input
                        className="input-field"
                        type="password"
                        placeholder="Confirm Password"
                        required
                    />
                    <button className="primary-btn mt-6" type="submit">
                        Sign Up
                    </button>
                    <div>
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="text-primary-400 hover:font-medium"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </form>
        </main>
    );
}
