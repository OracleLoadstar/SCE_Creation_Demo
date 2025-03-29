package com.UmaSCE.Creation.mix.runner;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.LineNumberReader;

public class runner {
    public static void runner(FileReader file,BufferedReader reader,LineNumberReader line_reader) throws Exception{
        String instand_of[]={"a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"};
        char temp_char='\0';boolean is_marked=false;int val_count=0;
        int val_index[]={};
        String val_String[]={};
        byte temp_byte=0;
        byte marked_byte=0;
        String temp_word="";
        while((temp_char=(char)file.read())!=-1){
            temp_word += temp_char;
            temp_byte++;
            if(temp_word=="this."){
                temp_word="";
                marked_byte = temp_byte;
                is_marked=true;
            }
            if(temp_char==' '&& is_marked==true){
                val_String[val_count]=temp_word;

                val_count++;
                temp_word="";
                is_marked=false;
            }

        }
    }
}
