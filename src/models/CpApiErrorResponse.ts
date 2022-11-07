type CpApiErrorResponse = {
   type: string;
   title: string;
   status: number;
   detail: string;
   instance: string; 
   errors: string[];
}

export default CpApiErrorResponse;