#include "pch.h"
#include "Winsock2.h"
#pragma comment(lib, "WS2_32.lib")



std::string GetErrorMsgText(int code) // cформировать текст ошибки
{
	std::string msgText;
	switch (code) // проверка кода возврата
	{
	case WSAEINTR: msgText = "WSAEINTR"; break;
	case WSAEACCES: msgText = "WSAEACCES"; break;
	case WSASYSCALLFAILURE: msgText = "WSASYSCALLFAILURE"; break;
	default: msgText = "***ERROR***"; break;
	};
	return msgText;
};



std::string SetErrorMsgText(std::string msgText, int code)
{
	return msgText + GetErrorMsgText(code);
};


