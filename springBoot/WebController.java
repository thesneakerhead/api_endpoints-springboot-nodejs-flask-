package com.example.MerchantSimulator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;


import lombok.extern.slf4j.Slf4j;

@Slf4j
@EnableAsync
@Controller
public class WebController {
	@Autowired
	private MerchantSimulatorMsg mMsg;
	@RequestMapping(value="/merchantsimulator")
	public String merchantsimultor(Model model)
	{
		SoapiMsg s2sMessage = mMsg.merchantSimulatorS2sMessage();
		SoapiMsg b2sMessage = mMsg.merchantSimulatorB2sMessage();
		model.addAttribute("s2s",s2sMessage);
		model.addAttribute("b2s",b2sMessage);
		return "merchantsim";
	}
	 @RequestMapping(value = "/checkoutpage")
	   public String checkoutpage(@RequestBody String message,Model model) throws JsonMappingException, JsonProcessingException {
		  ProductData pDat = new ProductData();
		  FERequestResponseHandler handler = new FERequestResponseHandler();
		  SoapiMsg msg = handler.stringToSoapiMsg(message);
		   
		  pDat.setProductName("Iphone 11");
		  pDat.setProductQty("1");
		  model.addAttribute("product",pDat); 
		  model.addAttribute("soapi",msg);
		  
	      return "checkoutpage";
	   }
	 @RequestMapping(value="/usercheckoutpage")
		public String usercheckoutpage(@RequestBody String message,Model model) throws JsonMappingException, JsonProcessingException
		{
			FERequestResponseHandler handler = new FERequestResponseHandler();
			model.addAttribute("b2s",handler.stringToSoapiMsg(message));
			return "usercheckoutpage";
		}
	 @RequestMapping(value="/successpage")
		public String successpage(@RequestBody String message,Model model) throws JsonMappingException, JsonProcessingException
		{
			FERequestResponseHandler handler = new FERequestResponseHandler();
			model.addAttribute("ResultMsg",handler.stringToResultMsg(message));
			return "successpage";
		}
}
