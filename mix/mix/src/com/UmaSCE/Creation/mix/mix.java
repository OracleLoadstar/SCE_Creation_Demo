package com.UmaSCE.Creation.mix;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.LineNumberReader;

public class mix{
    public static int main(String[] args) throws Exception {
        if (args.length == 0) {
            System.err.println("No arguments provided.");
            System.exit(1);
        }
        boolean temp_b=init_file(args[1]);
        if(!temp_b){
            System.err.println("Failed to initialize file.");
            System.exit(1);
        }
        return 0;
    }
    private static boolean init_file(String file_name) throws Exception {
        FileReader file = new FileReader(file_name);
        BufferedReader reader = new BufferedReader(file);
        LineNumberReader line_Reader = new LineNumberReader(reader);
        

        String line;
        while ((line = line_Reader.readLine()) != null) {
            
        }

        return false;
    }
}