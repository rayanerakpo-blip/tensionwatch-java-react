package com.tensionwatch.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class TensionEvaluationService {
    
    public Map<String, String> evaluerTension(Integer systolique, Integer diastolique) {
        Map<String, String> result = new HashMap<>();
        
        if (systolique >= 180 || diastolique >= 120) {
            result.put("niveau", "urgence");
            result.put("label", "Crise hypertensive - Consultez en urgence");
        } else if (systolique >= 140 || diastolique >= 90) {
            result.put("niveau", "haute");
            result.put("label", "Hypertension");
        } else if (systolique >= 120 || diastolique >= 80) {
            result.put("niveau", "elevee");
            result.put("label", "Tension élevée");
        } else {
            result.put("niveau", "normale");
            result.put("label", "Tension normale");
        }
        
        return result;
    }
}
