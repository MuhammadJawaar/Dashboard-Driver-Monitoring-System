import React from "react";
import { Metadata } from "next";
import Signin from "@/components/SignIn/page"


export const metadata: Metadata = {
  title: "Next.js SignIn Page | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Signin Page TailAdmin Dashboard Template",
};

const SignIn: React.FC = () => {
  return (
    <Signin/>
  );
};

export default SignIn;
