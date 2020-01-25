// ServerT.cpp : Этот файл содержит функцию "main". Здесь начинается и заканчивается выполнение программы.
//


#include "pch.h"
#include "error.h"
#include "Winsock2.h" // заголовок WS2_32.dll
#pragma comment(lib, "WS2_32.lib") // экспорт WS2_32.dll

#pragma warning(disable : 4996)


int _tmain(int argc, _TCHAR* argv[])
{

	SOCKET sS; // дескриптор сокета
	WSADATA wsaData;
	try
	{
		if (WSAStartup(MAKEWORD(2, 0), &wsaData) != 0)
			throw SetErrorMsgText("Startup:", WSAGetLastError());
		while (true) {
			if ((sS = socket(AF_INET, SOCK_STREAM, NULL)) == INVALID_SOCKET)
				throw SetErrorMsgText("socket:", WSAGetLastError());

			SOCKADDR_IN serv; // параметры сокета sS
			serv.sin_family = AF_INET; // используется IP-адресация
			serv.sin_port = htons(8000); // порт 2000
			serv.sin_addr.s_addr = INADDR_ANY; // любой собственный IP-адрес

			if (bind(sS, (LPSOCKADDR)&serv, sizeof(serv)) == SOCKET_ERROR)
				throw SetErrorMsgText("bind:", WSAGetLastError());
			if (listen(sS, SOMAXCONN) == SOCKET_ERROR)
				throw SetErrorMsgText("listen:", WSAGetLastError());

			SOCKET cS; // сокет для обмена данными с клиентом
			SOCKADDR_IN clnt; // параметры сокета клиента
			memset(&clnt, 0, sizeof(clnt)); // обнулить память
			int lclnt = sizeof(clnt); // размер SOCKADDR_IN

			if ((cS = accept(sS, (sockaddr*)&clnt, &lclnt)) == INVALID_SOCKET) {
				throw SetErrorMsgText("accept:", WSAGetLastError());
			}
			else {
				std::cout << inet_ntoa(clnt.sin_addr) << std::endl;
				std::cout << ntohs(clnt.sin_port) << std::endl;
			}

			char ibuf[100], //буфер отправления
				obuf[100] = "sever: принято "; //буфер получения
			int libuf = 0, //количество принятых байт
				lobuf = 0; //количество отправленных байт

			//for (auto i = 0; ; i++) {
				if ((libuf = recv(cS, obuf, sizeof(obuf), NULL)) == SOCKET_ERROR)
					throw SetErrorMsgText("recv:", WSAGetLastError());

				Sleep(50);

			/*	if (libuf == 3) {
					break;
				}
*/
				std::cout << obuf << std::endl;

				strcpy(ibuf, obuf);
				lobuf = libuf;
				std::string temp = "ECHO: ";
			//	temp += std::to_string(ibuf);
				//strncpy(ibuf, te, sizeof(ibuf));
				ibuf[sizeof(ibuf) - 1] = 0;
				lobuf = sizeof(ibuf);
				if ((lobuf = send(cS, ibuf, strlen(ibuf) + 1, NULL)) == SOCKET_ERROR)
					throw SetErrorMsgText("send:", WSAGetLastError());
		//	}

		/*	std::string temp = "Hello from client ";
			temp += std::to_string(i + 1);

			strncpy(ibuf, temp.c_str(), sizeof(ibuf));
			ibuf[sizeof(ibuf) - 1] = 0;
			lobuf = sizeof(ibuf);
			if ((lobuf = send(cC, ibuf, strlen(ibuf) + 1, NULL)) == SOCKET_ERROR)
				throw SetErrorMsgText("send:", WSAGetLastError());*/



			//if ((libuf = recv(cC, obuf, sizeof(obuf), NULL)) == SOCKET_ERROR) {
			//	throw SetErrorMsgText("recv:", WSAGetLastError());

			//}
			//else {

			//	std::cout << obuf << std::endl;
			//	i++;
			//}






			if (closesocket(cS) == SOCKET_ERROR)
				throw SetErrorMsgText("closesocket:", WSAGetLastError());
			if (closesocket(sS) == SOCKET_ERROR)
				throw SetErrorMsgText("closesocket:", WSAGetLastError());

			/*int vr = 0;
			std::cout << "Do you want to continue the server? Yes - 1 , No - 0 ;" << std::endl;
			std::cin >> vr;
			if (vr == 1) {
				goto start;
			}*/
		}
		if (WSACleanup() == SOCKET_ERROR)
			throw SetErrorMsgText("Cleanup:", WSAGetLastError());
	}
	catch (std::string errorMsgText)
	{
		std::cout << std::endl << errorMsgText;
	}
	return 0;
}

