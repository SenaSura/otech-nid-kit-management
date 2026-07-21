import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ShieldCheck
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import hero from "../assets/otech.png";


export default function Login() {

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Upon successful login
    navigate("/");
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-red-900 flex items-center justify-center p-6">

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">

        {/* Left Side */}

        <div className="hidden lg:flex bg-slate-900 text-white flex-col justify-center items-center p-12">

          <img
            src={hero}
            alt="Hero"
            className="w-80 mb-8 bg-white rounded-2xl"
          />

          <h1 className="text-4xl font-bold">

            OTech Asset

          </h1>

          <p className="mt-3 text-slate-300 text-center">

            National ID Asset Management System

          </p>

          <div className="mt-10 space-y-5">

            <div className="flex items-center gap-3">

              <ShieldCheck className="text-green-400" />

              <span>Secure Login</span>

            </div>

            <div className="flex items-center gap-3">

              <ShieldCheck className="text-green-400" />

              <span>Real-time Asset Tracking</span>

            </div>

            <div className="flex items-center gap-3">

              <ShieldCheck className="text-green-400" />

              <span>Transfer Management</span>

            </div>

            <div className="flex items-center gap-3">

              <ShieldCheck className="text-green-400" />

              <span>Maintenance Records</span>

            </div>

          </div>

        </div>

        {/* Right Side */}

        <div className="p-10 lg:p-16">

          <h2 className="text-4xl font-bold text-slate-800">

            Welcome Back

          </h2>

          <p className="text-slate-500 mt-2">

            Sign in to continue

          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-6"
          >

            <div>

              <label className="text-sm font-medium">

                Email Address

              </label>

              <div className="mt-2 flex items-center border rounded-xl px-4 py-3">

                <Mail size={20} className="text-gray-400" />

                <input

                  type="email"

                  placeholder="Enter email"

                  className="w-full outline-none ml-3"
                  required

                />

              </div>

            </div>

            <div>

              <label className="text-sm font-medium">

                Password

              </label>

              <div className="mt-2 flex items-center border rounded-xl px-4 py-3">

                <Lock size={20} className="text-gray-400" />

                <input

                  type={showPassword ? "text" : "password"}

                  placeholder="Password"

                  className="w-full outline-none ml-3"
                  required
                />

                <button

                  type="button"

                  onClick={() => setShowPassword(!showPassword)}

                >

                  {

                    showPassword

                      ?

                      <EyeOff size={20} />

                      :

                      <Eye size={20} />

                  }

                </button>

              </div>

            </div>

            <div className="flex justify-between text-sm">

              <label className="flex items-center gap-2">

                <input type="checkbox" />

                Remember Me

              </label>

              <a href="#" className="text-red-600">

                Forgot Password?

              </a>

            </div>

            <button

              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition"

            >

              Sign In

            </button>

          </form>

          <div className="mt-10 text-center text-sm text-slate-500">

            © 2026 OTech Engineering

          </div>

        </div>

      </div>

    </div>

  );
}