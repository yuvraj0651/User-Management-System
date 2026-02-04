const Footer = () => {
    return (
        <footer className="w-full bg-white border-t border-gray-200 mt-10">
            <div className="max-w-7xl mx-auto px-4 py-6">

                <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">

                    {/* Left */}
                    <div className="text-center md:text-left">
                        <h3 className="text-sm font-semibold text-gray-700">
                            User Management System
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                            © {new Date().getFullYear()} All rights reserved.
                        </p>
                    </div>

                    {/* Center */}
                    <div className="flex gap-4 justify-center flex-wrap">
                        {["Privacy Policy", "Terms of Service", "Help Center", "Contact"].map((item) => (
                            <span
                                key={item}
                                className="text-sm text-gray-500 hover:text-indigo-600 cursor-pointer transition"
                            >
                                {item}
                            </span>
                        ))}
                    </div>

                    {/* Right */}
                    <div className="text-center md:text-right">
                        <p className="text-xs text-gray-500">
                            Version 1.0.0
                        </p>
                        <p className="text-xs text-gray-400">
                            Powered by React & Tailwind CSS
                        </p>
                    </div>

                </div>

            </div>
        </footer>
    );
};

export default Footer;
