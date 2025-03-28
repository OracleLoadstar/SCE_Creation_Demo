///////////////////////
//   UmaSCE_Main     //
//   By LaT-SKY      //
///////////////////////
#pragma once

#include<string>
#include<map>
using namespace std;

enum
{
	friendship_award,
	enthusiasm_award,
	training_award,
	friendship_point,
	strike_point,
	speed_bonus,
	stamina_bonus,
	power_bonus,
	willpower_bonus,
	wit_bonus,
	sp_bonus
};


class UmaSCE_Main
{
protected:

	int type_static=0;
	int friendship_static=0;

	int friendship_award=0;
	int enthusiasm_award=0;
	int training_award=0;

	int strike_point=0;
	int friendship_point=0;

	int speed_bonus=0;
	int stamina_bonus=0;
	int power_bonus=0;
	int willpower_bonus=0;
	int wit_bonus=0;
	int sp_bonus=0;

	double v1_ept=0;
	double v2_ept=0;
	double v3_ept=0;

	int v4main_ept=0;
	int v4fold_ept=0;
	int v4sp_ept=0;

	int v5main_ept=0;
	int v5fold_ept=0;
	int v5sp_ept=0;
public:

	char cardname_static[20] = "δ����";

	struct UmaSCE_Main_Diset
	{
		int abex_di[5] = {};
		int tolerance_di[5] = {};
	};

	struct UmaSCE_Main_V5click
	{
		int ground[5];
	};

	void Exchange(UmaSCE_Main&);//a��b����
	void Copy(UmaSCE_Main);//a��b���ƣ�b��ֵ��a)
	void Input(string Val_Typename,int Val);//���ⲿ��ֵ��a
	void Import(int type_static_, int friendship_static_, int friendship_award_, int enthusiasm_award_, int training_award_, int strike_point_, int friendship_point_, int speed_bonus_, int stamina_bonus_, int power_bonus_, int willpower_bonus_, int wit_bonus_, int sp_bonus_);//������ֵ��a
	void Export(int& type_static_, int& friendship_static_, int& friendship_award_, int& enthusiasm_award_, int& training_award_, int& strike_point_, int& friendship_point_, int& speed_bonus_, int& stamina_bonus_, int& power_bonus_, int& willpower_bonus_, int& wit_bonus_, int& sp_bonus_) const;//�������a��ֵ,�˷������������ֵ÷�
	void Export(double& v1_ept_, double& v2_ept_, double& v3_ept_, int& v4main_ept_, int& v4fold_ept_, int& v4sp_ept_, int& v5main_ept_, int& v5fold_ept_, int& v5sp_ept_) const;//�������ept��ֵ
	template<typename T> T Output(string Val_Typename) const;//����Val_Typename�ṩ����
	template<typename T> void Output(string Val_Typename, T& Carrier) const;//����Val_Typename�ṩ����
	void Destroy();//���a��ֵ
	void Destroy(string Val_Typename);//��������a���a��ֵ

	void Layout(string Val_Typename, int Val);//��Uma_SCE_Main���в��֣�������

	void EvalV1();//����v1
	double EvalV1(bool is_return);//ֱ�ӷ���ֵ
	void EvalV1(double& Carrier);//ֱ�ӻ��v1_ept

	void EvalV2();//����v2
	double EvalV2(bool is_return);//ֱ�ӷ���ֵ
	void EvalV2(double& Carrier);//ֱ�ӻ��v2_ept

	void EvalV3();//����v3
	double EvalV3(bool is_return);//ֱ�ӷ���ֵ
	void EvalV3(double& strike_rate, double& unstrike_rate) const;//��õ�����
	void EvalV3(double& Carrier);//ֱ�ӻ��v3_ept

	void EvalV4();//����v4
	void EvalV4(int& Carrier_main, int& Carrier_fold, int& Carrier_sp);//ֱ�ӻ��v4_ept
	void EvalV4(double& Carrier_failure_rate);//ֱ�ӻ��failure_rate

	void EvalDi(UmaSCE_Main_Diset diset);//����di
	void EvalDi(UmaSCE_Main_Diset diset, int& Carrier_main, int& Carrier_fold, int& Carrier_sp);//ֱ�ӻ��di

	void EvalV5(int times);//����v5

private:
	
	double unstrike_v1_ept=0;
	bool is_notice=true;
	bool is_dominant_lead=false;
	int length=10;
	int present_ground=-1;
	int present_friendship_point=0;
	UmaSCE_Main_V5click v5click = {};
	//map<string, int> valmap_int{};
	//map<string, double> valmap_double{};
	//map<string, bool> valmap_bool{};
	//void Maprefresh();//����map
};

bool is_award_static_global=true;

void AddAwardStatic(UmaSCE_Main uma1,UmaSCE_Main& uma2,int award_type,int award_value)
{
	int temp;
	switch(award_type)
	{
		case friendship_award:
		{
			uma1.Output("friendship_award",temp);
			uma2.Input("friendship_award",temp + award_value);
			break;
		}
		case enthusiasm_award:
		{
			uma1.Output("enthusiasm_award",temp);
			uma2.Input("enthusiasm_award",temp + award_value);
			break;
		}
		case training_award:
		{
			uma1.Output("training_award",temp);
			uma2.Input("training_award",temp + award_value);
			break;
		}
		case friendship_point:
		{
			uma1.Output("friendship_point",temp);
			uma2.Input("friendship_point",temp + award_value);
			break;
		}
		case strike_point:
		{
			uma1.Output("strike_point", temp);
			uma2.Input("strike_point", temp + award_value);
			break;
		}
		case speed_bonus:
		{
			uma1.Output("speed_bonus", temp);
			uma2.Input("speed_bonus", temp + award_value);
			break;
		}
		case stamina_bonus:
		{
			uma1.Output("stamina_bonus", temp);
			uma2.Input("stamina_bonus", temp + award_value);
			break;
		}
		case power_bonus:
		{
			uma1.Output("power_bonus", temp);
			uma2.Input("power_bonus", temp + award_value);
			break;
		}
		case willpower_bonus:
		{
			uma1.Output("willpower_bonus",temp);
			uma2.Input("willpower_bonus",temp+award_value);
			break;
		}
		case wit_bonus:
		{
			uma1.Output("wit_bonus", temp);
			uma2.Input("wit_bonus", temp + award_value);
			break;
		}
		case sp_bonus:
		{
			uma1.Output("sp_bonus", temp);
			uma2.Input("sp_bonus", temp + award_value);
			break;
		}
		default:
		{
			throw "�����award_type";
		}
	}
}