import { createSupabaseServerComponentClient } from "../lib/supabase/server-client";
import DetailsButtonClient from "./details-button-client";

export default async function DetailsButtonServer() {
	const supabase = createSupabaseServerComponentClient();

	if (!supabase || !supabase.auth) {
	  console.error('Supabase client or auth is undefined');
	  return;
	}

	const {
	  data: { session },
	  error,
	} = await supabase.auth.getSession();
  
  return <DetailsButtonClient session={session} />;
}
