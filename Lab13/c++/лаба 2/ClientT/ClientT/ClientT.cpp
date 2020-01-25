// ClientT.cpp : Этот файл содержит функцию "main". Здесь начинается и заканчивается выполнение программы.
//

#include "pch.h"
#include "error.h"
#include "Winsock2.h" // заголовок WS2_32.dll
#include <ctime> 
#pragma comment(lib, "WS2_32.lib") // экспорт WS2_32.dll

#pragma warning(disable : 4996)

int _tmain(int argc, _TCHAR* argv[])
{

	SOCKET cC; // серверный сокет
	WSADATA wsaData;
	int t = clock();
	try
	{
		if (WSAStartup(MAKEWORD(2, 0), &wsaData) != 0)
			throw SetErrorMsgText("Startup:", WSAGetLastError());
	
		if ((cC = socket(AF_INET, SOCK_STREAM, NULL)) == INVALID_SOCKET)
			throw SetErrorMsgText("socket:", WSAGetLastError());

		SOCKADDR_IN serv; // параметры сокета клиента
		serv.sin_family = AF_INET; // используется IP-адресация
		serv.sin_port = htons(8000); // TCP-порт 2000
		serv.sin_addr.s_addr = inet_addr("127.0.0.1"); // адрес клиента
		if ((connect(cC, (sockaddr*)&serv, sizeof(serv))) == SOCKET_ERROR)
			throw SetErrorMsgText("connect:", WSAGetLastError());
		char ibuf[100], //буфер отправления
			obuf[100] = "client: принято "; //буфер получения
		int libuf = 0, //количество принятых байт
			lobuf = 0; //количество отправленных байт

	/*	
		for (auto i = 0; i < 1000;) {
			std::string temp = "Hello from client ";
			temp += std::to_string(i+1);

			strncpy(ibuf, temp.c_str(), sizeof(ibuf));
			ibuf[sizeof(ibuf) - 1] = 0;
			lobuf = sizeof(ibuf);
			if ((lobuf = send(cC, ibuf, strlen(ibuf) + 1, NULL)) == SOCKET_ERROR)
				throw SetErrorMsgText("send:", WSAGetLastError());

			

			if ((libuf = recv(cC, obuf, sizeof(obuf), NULL)) == SOCKET_ERROR) {
				throw SetErrorMsgText("recv:", WSAGetLastError());

			}
			else {

				std::cout << obuf << std::endl;
				i++;
			}
			
		}
		std::string temp = "/0";
		strncpy(ibuf, temp.c_str(), sizeof(ibuf));
		ibuf[sizeof(ibuf) - 1] = 0;
		lobuf = sizeof(ibuf);
		
		if ((lobuf = send(cC, ibuf, strlen(ibuf) + 1, NULL)) == SOCKET_ERROR)
			throw SetErrorMsgText("send:", WSAGetLastError());

		*/
		
		std::string temp = "Hello from client ";
		
		strncpy(ibuf, temp.c_str(), sizeof(ibuf));
		ibuf[sizeof(ibuf) - 1] = 0;
		lobuf = sizeof(ibuf);
		if ((lobuf = send(cC, ibuf, strlen(ibuf) + 1, NULL)) == SOCKET_ERROR)
			throw SetErrorMsgText("send:", WSAGetLastError());



		if ((libuf = recv(cC, obuf, sizeof(obuf), NULL)) == SOCKET_ERROR) {
			throw SetErrorMsgText("recv:", WSAGetLastError());

		}
		else {

			std::cout << obuf << std::endl;
			
		}
		


		if (closesocket(cC) == SOCKET_ERROR)
			throw SetErrorMsgText("closesocket:", WSAGetLastError());

		if (WSACleanup() == SOCKET_ERROR)
			throw SetErrorMsgText("Cleanup:", WSAGetLastError());

		std::cout << "It took to calculate "
			<< t << " ticks of time or "
			<< ((float)t) / CLOCKS_PER_SEC << " second.n"<<std::endl;
	}
	catch (std::string errorMsgText)
	{
		std::cout << std::endl << errorMsgText;
	}
	return 0;
}

