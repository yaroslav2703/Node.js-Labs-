// ClientU.cpp : Этот файл содержит функцию "main". Здесь начинается и заканчивается выполнение программы.
//

#include "pch.h"
#include "error.h"
#include "Winsock2.h" // заголовок WS2_32.dll
#include <ctime> 
#pragma comment(lib, "WS2_32.lib") // экспорт WS2_32.dll

#pragma warning(disable : 4996)

int _tmain(int argc, _TCHAR* argv[])
{
	int n = 100;
	//std::cout << " how many messages need to be sent ? ";
	//std::cin >> n;
	int quality_of_req = 0;
	SOCKET cC; 
	WSADATA wsaData;
	int t = clock();
	try
	{
		if (WSAStartup(MAKEWORD(2, 0), &wsaData) != 0)
			throw SetErrorMsgText("Startup:", WSAGetLastError());

		if ((cC = socket(AF_INET, SOCK_DGRAM, NULL)) == INVALID_SOCKET)
			throw SetErrorMsgText("socket:", WSAGetLastError());

	
		SOCKADDR_IN serv; // параметры сокета сервера
		serv.sin_family = AF_INET; // используется ip-адресация
		serv.sin_port = htons(8000); // порт 2000
		serv.sin_addr.s_addr = inet_addr("127.0.0.1"); // адрес сервера
		int srv = sizeof(serv);

		char obuf[50] = "Message to udp server."; //буфер данных для отправки на сервер
		int lobuf = 0; //количество отправленных байт

	//	for (auto i = 0; i < n;) {
		//	std::string temp = "Hello from client ";
			////temp += std::to_string(i + 1);

		/*	strncpy(obuf, temp.c_str(), sizeof(obuf));
			obuf[sizeof(obuf) - 1] = 0;
			lobuf = sizeof(obuf);*/

		

		if ((lobuf = sendto(cC, obuf, strlen(obuf) + 1, NULL, (sockaddr*)&serv, sizeof(serv))) == SOCKET_ERROR)
			throw SetErrorMsgText("send:", WSAGetLastError());
		quality_of_req++;
		Sleep(0.01);
	

		char ibuf[50]; //буфер данных от сервера
		int ib = 0; //количество принятых байт

		if ((ib = recvfrom(cC, ibuf, sizeof(ibuf), NULL, (sockaddr*)&serv, &srv)) == SOCKET_ERROR){
			throw SetErrorMsgText("recv:", WSAGetLastError());
		}
		else {

			std::cout << ibuf << std::endl;
		//	i++;
		}
		
	//	}
	/*	std::cout << "requests sent: " << quality_of_req << std::endl;
		std::string temp = "/0";
		strncpy(obuf, temp.c_str(), sizeof(obuf));
		obuf[sizeof(obuf) - 1] = 0;
		lobuf = sizeof(obuf);

		if ((lobuf = sendto(cC, obuf, strlen(obuf) + 1, NULL, (sockaddr*)&serv, sizeof(serv))) == SOCKET_ERROR)
			throw SetErrorMsgText("send:", WSAGetLastError());
*/
	
		if (closesocket(cC) == SOCKET_ERROR)
			throw SetErrorMsgText("closesocket:", WSAGetLastError());

		if (WSACleanup() == SOCKET_ERROR)
			throw SetErrorMsgText("Cleanup:", WSAGetLastError());

		std::cout << "It took to calculate "
			<< t << " ticks of time or "
			<< ((float)t) / CLOCKS_PER_SEC << " second.n" << std::endl;
	}
	catch (std::string errorMsgText)
	{
		std::cout << std::endl << errorMsgText;
	}
	return 0;
}



