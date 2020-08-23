package com.fzu.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.JSONSerializer;
import com.fzu.dao.QuestionDao;
import com.fzu.dao.StudentDao;
import com.fzu.pojo.Question;
import com.fzu.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class IndexController {
    @Autowired
    QuestionDao questionDao;
    @Autowired
    StudentDao studentDao;

    @RequestMapping("/hi")
    public String index(){
        return "index";
    }

    @ResponseBody
    @RequestMapping("/test")
    public void test(){
        Question question = new Question();
        question.setAnswer("BDd");
        System.out.println(question.exchangeAnswer());
    }

    @ResponseBody
    @RequestMapping("/test2")
    public void test2(){
       studentDao.getClassId("20191112");
    }

    @ResponseBody
    @RequestMapping("/getServerIP")
    public Map<String, String> getServerIP(HttpServletRequest request){
        Map<String, String> result = new HashMap<String, String>();
        studentDao.getClassId("20191112");
        String IP = request.getRemoteAddr();
        int p = request.getRemotePort();
        String port = Integer.toString(p);
        result.put("IP",IP);
        result.put("port",port);
        System.out.println(result);
        return result;
    }


}
