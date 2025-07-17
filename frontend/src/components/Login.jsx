import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { LoginUser, reset } from "../features/authSlice";
import Swal from "sweetalert2";
import ReCAPTCHA from "react-google-recaptcha";
import loginImage from "../assets/login-image.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const captchaRef = useRef(null);

  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (user || isSuccess) {
      navigate("/dashboard");
    }

    const resetTimeout = setTimeout(() => {
      dispatch(reset());
    }, 2500);

    return () => {
      clearTimeout(resetTimeout);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [user, isSuccess, dispatch, navigate]);

  const Auth = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      Swal.fire({
        title: "Captcha Belum Dicentang",
        text: "Silakan centang reCAPTCHA dulu",
        icon: "warning",
      });
      return;
    }

    try {
      await dispatch(LoginUser({ email, password, token: captchaToken })).unwrap();
    } catch (err) {
      const statusMessage = err?.msg || "Login gagal.";
      const resetTime = err?.resetTime ? new Date(err.resetTime).getTime() : null;
      const now = new Date().getTime();
      const seconds = resetTime ? Math.ceil((resetTime - now) / 1000) : 0;

      if (seconds > 0) {
        setCountdown(seconds);

        let interval;
        Swal.fire({
          title: "Terlalu Banyak Percobaan",
          html: `Coba lagi dalam <b>${seconds}</b> detik...`,
          timer: seconds * 1000,
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            const b = Swal.getHtmlContainer().querySelector("b");
            countdownRef.current = setInterval(() => {
              setCountdown((prev) => {
                if (prev <= 1) {
                  clearInterval(countdownRef.current);
                  dispatch(reset()); // ✅ reset error
                  return 0;
                }
                const next = prev - 1;
                if (b) b.textContent = next;
                return next;
              });
            }, 1000);
          },
          willClose: () => {
            clearInterval(countdownRef.current);
          },
        });

        // ✅ Tambahkan timeout manual juga untuk pastikan reset jalan
        setTimeout(() => {
          setCountdown(0);
          dispatch(reset());
        }, seconds * 1000);
      } else {
        Swal.fire({
          title: "Login Gagal",
          text: statusMessage,
          icon: "error",
        });
      }

      setCaptchaToken("");
      if (captchaRef.current) captchaRef.current.reset();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-200 to-blue-300">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left image */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200 p-4">
          <img
            src={loginImage}
            alt="Login Illustration"
            className="w-full h-auto object-contain max-h-[400px]"
          />
        </div>

        {/* Right Form */}
        <div className="p-8 md:p-10">
          <h2 className="text-3xl font-bold text-green-600 text-center mb-6">
            Login
          </h2>

          {(isError || countdown > 0) && (
            <p className="text-center text-red-500 font-medium mb-3">
              {countdown > 0
                ? `Terlalu banyak percobaan. Coba lagi dalam ${countdown} detik...`
                : message}
            </p>
          )}

          <form onSubmit={Auth} className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className={`w-full px-4 py-2 border ${
                  touched.email && !email ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched({ ...touched, email: true })}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className={`w-full px-4 py-2 border ${
                  touched.password && !password
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched({ ...touched, password: true })}
                placeholder="******"
              />
            </div>

            <div className="flex justify-center">
              <ReCAPTCHA
                ref={captchaRef}
                sitekey="6LcgJX8rAAAAAGiwZ0TnPhB29iLhQ9iMzMRuOc37"
                onChange={(token) => setCaptchaToken(token)}
                theme="light"
              />
            </div>

            <button
              type="submit"
              disabled={countdown > 0}
              className={`w-full font-semibold py-2 rounded-lg transition duration-200 ${
                countdown > 0
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {isLoading ? "Loading..." : "Login"}
            </button>

            <div className="text-center text-sm text-gray-600 mt-4">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:underline font-medium"
              >
                Daftar di sini
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
