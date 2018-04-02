package Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Test {
	public static void main(String[] args) {
		int[] s = new int[]{8,6,9,7,0};
		for(int j=0; j<s.length-1; j++){
			for(int i=0; i<s.length-1; i++){
				if(s[i] > s[i+1]){
					int mid = s[i];
					s[i] = s[i+1];
					s[i+1] = mid;
				}
			}
		}
		for(int i=0; i<s.length; i++){
			System.out.println(s[i]);
		}
		
		int[] array = new int[]{8,6,7,9,0};
//		boolean swaped;
//		int n = array.length;
//		do {
//			swaped = false;
//			for (int i = 1; i < n; i++) {
//				if (array[i - 1] > array[i]) {
//					int temp = array[i - 1];
//					array[i - 1] = array[i];
//					array[i] = temp;
//					swaped = true;
//				}
//		    }
//		    n--;
//		} 
//		while (swaped);
		char[] ca = new char[]{'d','b','c'};
		Arrays.sort(ca);
		Arrays.sort(array);
		for(int i=0; i<array.length; i++){
			System.out.println(array[i]);
		}
		for(int i=0; i<ca.length; i++){
			System.out.println(ca[i]);
		}
	}
}
