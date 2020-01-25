// ServerU.cpp : Этот файл содержит функцию "main". Здесь начинается и заканчивается выполнение программы.
//

#include "pch.h"
#include "error.h"
#include "Winsock2.h" // заголовок WS2_32.dll
#pragma comment(lib, "WS2_32.lib") // экспорт WS2_32.dll

#pragma warning(disable : 4996)


int _tmain(int argc, _TCHAR* argv[])
{
	int quality_of_req = 0;
	SOCKET sS; // дескриптор сокета
	WSADATA wsaData;
	try
	{
		if (WSAStartup(MAKEWORD(2, 0), &wsaData) != 0)
			throw SetErrorMsgText("Startup:", WSAGetLastError());
		while (true) {
			if ((sS = socket(AF_INET, SOCK_DGRAM, NULL)) == INVALID_SOCKET)
				throw SetErrorMsgText("socket:", WSAGetLastError());

			SOCKADDR_IN serv; // параметры сокета sS
			serv.sin_family = AF_INET; // используется IP-адресация
			serv.sin_port = htons(8000); // порт 2000
			serv.sin_addr.s_addr = INADDR_ANY; // адрес сервера

			if (bind(sS, (LPSOCKADDR)&serv, sizeof(serv)) == SOCKET_ERROR)
				throw SetErrorMsgText("bind:", WSAGetLastError());


			SOCKADDR_IN clnt; // параметры сокета клиента
			memset(&clnt, 0, sizeof(clnt)); // обнулить память
			int lc = sizeof(clnt);


			char obuf[50]; //буфер данных от клиента
			int lb = 0; //количество принятых байт

		//	for (auto i = 0; ; i++) {
				if ((lb = recvfrom(sS, obuf, sizeof(obuf), NULL, (sockaddr*)&clnt, &lc)) == SOCKET_ERROR)
					throw SetErrorMsgText("recv:", WSAGetLastError());

				/*if (i == 30 || i == 64 || i == 65) {
					i++;
					continue;*/
				

		/*		if (lb == 3) {
					break;
				}*/
				std::cout << obuf << std::endl;
				quality_of_req++;

				char ibuf[50] = "server"; //буфер данных клиенту
				int ib = 0; //количество отправленных байт

				strcpy(ibuf, obuf);
				lb = ib;

				if ((ib = sendto(sS, ibuf, strlen(ibuf) + 1, NULL, (sockaddr*)&clnt, sizeof(clnt))) == SOCKET_ERROR)
					throw SetErrorMsgText("send:", WSAGetLastError());
				
				

		//	}
			std::cout <<"requests came: "<< quality_of_req<<std::endl;
		
			if (closesocket(sS) == SOCKET_ERROR)
				throw SetErrorMsgText("closesocket:", WSAGetLastError());

			//int vr = 0;
			//std::cout << "Do you want to continue the server? Yes - 1 , No - 0 ;" << std::endl;
			//std::cin >> vr;
			//if (vr == 1) {
			//	/*goto start;*/
			//}
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
