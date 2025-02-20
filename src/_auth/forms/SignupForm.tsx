import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignupValidation } from "@/lib/validation";

import { Link, useNavigate } from "react-router-dom";
import Loader from '@/components/shared/Loader'
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queryAndMutation";
import { useUserContext } from "@/context/AuthContext";



const SignupForm = () => {

  
  const { toast } = useToast()

  const {checkAuthUser} = useUserContext()

  const {mutateAsync : createUserAccount, isPending: isCreatingAccount} = useCreateUserAccount();
  const {mutateAsync : singInAccount} = useSignInAccount();

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    const newUser = await createUserAccount(values);
    
    if(!newUser){
      return toast({
        title: "Sign up failed. Please try again."
      });
    }

    const session = await singInAccount({
      email: values.email, 
      password: values.password
    });

    if(!session){
      return toast({title: "Sign in failed. Please try again."})
    }

    const isLoggedIn = await checkAuthUser();
    if(isLoggedIn){
      navigate("/")
    }else{
      toast({title:"Sign up failed. Please try again."})
    }
  }

  return (
    <>
      <Form {...form}>
        <div className="sm:w-420 flex-center flex-col">
          <img src="/assets/images/logo_1_removebg.png" alt="logo" className="w-52" />
          <h2 className="h3-bold md:h2-bold sm:pt-4">Create a new account</h2>
          <p className="text-light-3 small-medium md:base-regular mt-2">
            To use Asocial, please enter your account details
          </p>
          <form className="flex flex-col gap-5 w-full mt-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="shad-button_primary">
              {isCreatingAccount ?
              (
                <div className="flex center gap-2">
                  <Loader/> Loading...
                </div>
              )
              : "Sign up"
            }
            </Button>
            <p className="text-small-regular text-light-2 text-center mt-2">
              Already have an account ?
              <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">Log In</Link>
            </p>
          </form>
        </div>
      </Form>
    </>
  );
};

export default SignupForm;
